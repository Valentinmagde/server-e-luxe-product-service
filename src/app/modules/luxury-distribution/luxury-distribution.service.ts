import Product from "../product/product.model";
import LdCategoryMapping from "./ld-category-mapping.model";
import LdAttributeMapping from "./ld-attribute-mapping.model";
import LdTagMapping from "./ld-tag-mapping.model";
import LdScanCache from "./ld-scan-cache.model";
import Category from "../category/category.model";
import facebookCatalog from "./facebook-catalog.service";

const LD_API_URL =
  process.env.LD_API_URL || "https://api.luxury-distribution.com/api";
const LD_PUBLIC_KEY = process.env.LD_PUBLIC_KEY || "";
const LD_USERNAME = process.env.LD_USERNAME || "";
const LD_IDENTIFIER = process.env.LD_IDENTIFIER || "";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

const LD_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class LuxuryDistributionService {
  private async getToken(): Promise<string> {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return cachedToken;
    }

    const res = await fetch(`${LD_API_URL}/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: LD_PUBLIC_KEY,
      },
      body: JSON.stringify({
        credentials: { username: LD_USERNAME, identifier: LD_IDENTIFIER },
      }),
    });

    if (!res.ok) {
      throw Object.assign(
        new Error("Failed to authenticate with Luxury Distribution"),
        { status: 502 }
      );
    }

    const data = await res.json() as any;
    cachedToken = data.data.token;
    tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 min (token valid 60 min)
    return cachedToken!;
  }

  /**
   * Browse Luxury Distribution catalog, enriched with imported flag.
   */
  public async browse(offset: number, limit: number, search?: string) {
    const token = await this.getToken();

    const url = `${LD_API_URL}/v2/stocks?offset=${offset}&limit=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw Object.assign(
        new Error("Failed to fetch products from Luxury Distribution"),
        { status: 502 }
      );
    }

    const data = await res.json() as any;
    let products: any[] = data.data?.data || [];
    const total: number = data.data?.total || 0;

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    const externalIds = products.map((p: any) => String(p.id));

    const [importedDocs, attributeMappings, tagMappings] = await Promise.all([
      Product.find({ source: "luxury_distribution", external_id: { $in: externalIds } })
        .select("external_id status variants tag")
        .lean() as Promise<any[]>,
      LdAttributeMapping.find().select("ld_value").lean() as Promise<any[]>,
      LdTagMapping.find().select("ld_tag").lean() as Promise<any[]>,
    ]);

    const mappedLdValues = new Set(attributeMappings.map((m: any) => m.ld_value));
    const mappedLdTags = new Set(tagMappings.map((m: any) => m.ld_tag));
    const importedMap = new Map(importedDocs.map((p: any) => [p.external_id, p]));

    return {
      products: products.map((p: any) => {
        const doc = importedMap.get(String(p.id));

        const rawTags: string[] = [
          ...(p.products_tags || []),
          p.gender?.name,
        ].filter(Boolean);
        const has_unmapped_tags = rawTags.some((t: string) => !mappedLdTags.has(t));

        const sizes: string[] = (p.size_quantity || []).map((o: any) => Object.keys(o)[0]);
        const has_unmapped_variants = sizes.some((s: string) => !mappedLdValues.has(s));

        return {
          ...p,
          imported: doc !== undefined,
          published: doc?.status === "show",
          has_unmapped_variants,
          has_unmapped_tags,
        };
      }),
      total: search ? products.length : total,
      offset,
      limit,
    };
  }

  /**
   * Import a single product from LD into the e-luxe database.
   */
  public async importProduct(stockId: string, categoryId: string) {
    const existing = await Product.findOne({
      source: "luxury_distribution",
      external_id: stockId,
    });

    if (existing) {
      throw Object.assign(new Error("Product already imported"), {
        status: 409,
      });
    }

    const token = await this.getToken();
    const res = await fetch(`${LD_API_URL}/v2/stocks/${stockId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw Object.assign(
        new Error("Product not found in Luxury Distribution"),
        { status: 404 }
      );
    }

    const data = await res.json() as any;
    const ld = data.data;

    this.assertMappingsComplete(await this.computeUnmapped(ld));

    const mapped = await this.mapProduct(ld, categoryId);
    const product = await Product.create(mapped);

    facebookCatalog.upsert({
      retailer_id: facebookCatalog.buildRetailerId(stockId),
      title: ld.name || "",
      description: mapped.description?.en || ld.name || "",
      price: mapped.prices.price,
      availability: (ld.qty || 0) > 0 ? "in stock" : "out of stock",
      image_url: (ld.images || [])[0] || "",
      product_url: facebookCatalog.buildProductUrl(String(product._id)),
      brand: ld.brand,
    }).catch((err) => console.error("[FacebookCatalog] importProduct:", err));

    return product;
  }

  /**
   * Remove an imported product from the e-luxe database.
   */
  public async removeProduct(stockId: string) {
    const result = await Product.findOneAndDelete({
      source: "luxury_distribution",
      external_id: stockId,
    });

    if (!result) {
      throw Object.assign(new Error("Product not imported"), { status: 404 });
    }

    facebookCatalog.delete(facebookCatalog.buildRetailerId(stockId))
      .catch((err) => console.error("[FacebookCatalog] removeProduct:", err));

    return result;
  }

  /**
   * Sync price and stock for an already-imported product.
   */
  public async syncProduct(stockId: string) {
    const token = await this.getToken();
    const res = await fetch(`${LD_API_URL}/v2/stocks/${stockId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw Object.assign(
        new Error("Product not found in Luxury Distribution"),
        { status: 404 }
      );
    }

    const data = await res.json() as any;
    const ld = data.data;

    this.assertMappingsComplete(await this.computeUnmapped(ld));

    const retailPrice = parseFloat(ld.original_price) || 0;
    const [variants, tags] = await Promise.all([
      this.buildVariants(ld),
      this.buildTags(ld),
    ]);

    const updated = await Product.findOneAndUpdate(
      { source: "luxury_distribution", external_id: stockId },
      {
        "prices.original_price": retailPrice,
        "prices.price": retailPrice,
        "prices.purchase_cost": ld.selling_price || 0,
        current_stock: ld.qty || 0,
        status: (ld.qty || 0) > 0 ? "show" : "hide",
        ...(ld.images?.length && { image: ld.images }),
        ...(ld.ean && { barcode: ld.ean }),
        variants,
        is_combination: variants.length > 0,
        tags,
        last_synced_at: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      throw Object.assign(new Error("Product not imported yet"), {
        status: 404,
      });
    }

    facebookCatalog.upsert({
      retailer_id: facebookCatalog.buildRetailerId(stockId),
      title: updated.name || "",
      description: (updated.description as any)?.en || updated.name || "",
      price: (updated.prices as any)?.price || 0,
      availability: updated.status === "show" ? "in stock" : "out of stock",
      image_url: ((updated.image as string[]) || [])[0] || "",
      product_url: facebookCatalog.buildProductUrl(String(updated._id)),
      brand: (updated as any).brand,
    }).catch((err) => console.error("[FacebookCatalog] syncProduct:", err));

    return updated;
  }

  public async getLdCategories(): Promise<{ id: number; name: string; parent_id: number | null }[]> {
    const token = await this.getToken();
    const res = await fetch(`${LD_API_URL}/v1/product-category`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw Object.assign(
        new Error("Failed to fetch categories from Luxury Distribution"),
        { status: 502 }
      );
    }

    const data = await res.json() as any;
    const categories: { id: number; name: string; parent_id: number | null }[] = [];

    for (const cat of data.data || []) {
      categories.push({ id: cat.id, name: cat.name, parent_id: cat.parent_id ?? null });
      for (const child of cat.children || []) {
        categories.push({ id: child.id, name: child.name, parent_id: child.parent_id ?? cat.id });
      }
    }

    return categories;
  }

  public async getCategoryMappings() {
    return LdCategoryMapping.find().populate("eluxe_category", "name _id").lean();
  }

  public async saveCategoryMappings(
    mappings: { ld_category: string; eluxe_category_id: string | null }[]
  ) {
    const ops = mappings.map(({ ld_category, eluxe_category_id }) => {
      if (!eluxe_category_id) {
        return {
          deleteOne: { filter: { ld_category } },
        };
      }
      return {
        updateOne: {
          filter: { ld_category },
          update: { $set: { eluxe_category: eluxe_category_id } },
          upsert: true,
        },
      };
    });

    if (ops.length === 0) return { ok: true };
    return LdCategoryMapping.bulkWrite(ops as any[]);
  }

  public async getAttributeMappings() {
    return LdAttributeMapping.find()
      .populate("eluxe_attribute", "name variants _id")
      .lean();
  }

  public async saveAttributeMappings(
    mappings: { ld_value: string; eluxe_attribute_id: string | null; eluxe_variant_id: string | null }[]
  ) {
    const ops = mappings.map(({ ld_value, eluxe_attribute_id, eluxe_variant_id }) => {
      if (!eluxe_attribute_id || !eluxe_variant_id) {
        return { deleteOne: { filter: { ld_value } } };
      }
      return {
        updateOne: {
          filter: { ld_value },
          update: { $set: { eluxe_attribute: eluxe_attribute_id, eluxe_variant_id } },
          upsert: true,
        },
      };
    });

    if (ops.length === 0) return { ok: true };
    return LdAttributeMapping.bulkWrite(ops as any[]);
  }

  public async togglePublish(stockId: string, published: boolean) {
    const updated = await Product.findOneAndUpdate(
      { source: "luxury_distribution", external_id: stockId },
      { status: published ? "show" : "hide" },
      { new: true }
    );

    if (!updated) {
      throw Object.assign(new Error("Product not imported"), { status: 404 });
    }

    facebookCatalog.updateAvailability(
      facebookCatalog.buildRetailerId(stockId),
      published ? "in stock" : "out of stock"
    ).catch((err) => console.error("[FacebookCatalog] togglePublish:", err));

    return updated;
  }

  private async translateText(text: string, from: string = "en", to: string = "fr"): Promise<string> {
    if (!text || !text.trim()) return text;
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      const res = await fetch(url);
      if (!res.ok) return text;
      const data = await res.json() as any;
      const translated = data?.responseData?.translatedText;
      return translated && translated !== text ? translated : text;
    } catch {
      return text;
    }
  }

  private async getCategoryHierarchy(categoryId: string): Promise<string[]> {
    const ids: string[] = [];
    let currentId: string | null = categoryId;
    const visited = new Set<string>();
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const cat: { parent_id?: string } | null = await Category.findById(currentId).select("parent_id").lean();
      if (!cat) break;
      ids.push(currentId);
      currentId = (cat as any).parent_id || null;
    }
    return ids;
  }

  private async buildVariants(ld: any): Promise<any[]> {
    const attributeMappings = await LdAttributeMapping.find().lean() as any[];
    const mappingByLdValue = new Map<string, { attrId: string; variantId: string }>(
      attributeMappings.map((m) => [
        m.ld_value,
        { attrId: String(m.eluxe_attribute), variantId: String(m.eluxe_variant_id) },
      ])
    );

    const retailPrice = parseFloat(ld.original_price) || 0;
    const purchaseCost = parseFloat(ld.selling_price) || 0;

    const sizeEntries: { size: string; quantity: number }[] = (ld.size_quantity || []).map(
      (sizeObj: any) => {
        const size = Object.keys(sizeObj)[0];
        const quantity = parseInt(sizeObj[size]) || 0;
        return { size, quantity };
      }
    );

    return sizeEntries.map(({ size, quantity }, i) => {
      const sizeMapping = mappingByLdValue.get(size);
      const attrPart: Record<string, string> = {};
      if (sizeMapping) attrPart[sizeMapping.attrId] = sizeMapping.variantId;

      // Human-readable LD values keyed by e-luxe attribute ID, for front-end fallback display
      const ldAttributeValues: Record<string, string> = {};
      if (sizeMapping) ldAttributeValues[sizeMapping.attrId] = size;

      return {
        ...attrPart,
        ld_size: size,
        ...(ld.color_detail && { ld_color: ld.color_detail }),
        ld_attribute_values: ldAttributeValues,
        ...(!sizeMapping && { size }),
        quantity,
        original_price: retailPrice,
        price: retailPrice,
        purchase_cost: purchaseCost,
        sku: `LD-${ld.sku}-${size}`,
        product_id: `LD-${ld.id}-${i}`,
        ld_stock_id: String(ld.id),
        ld_variant_ref: ld.variant || undefined,
      };
    });
  }

  private async buildTags(ld: any): Promise<string[]> {
    const rawTags: string[] = [
      ...(ld.products_tags || []),
      ld.gender?.name,
    ].filter(Boolean).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

    if (rawTags.length === 0) return [];

    const mappings = await LdTagMapping.find({ ld_tag: { $in: rawTags } }).lean() as any[];
    return mappings.map((m) => String(m.eluxe_tag_id));
  }

  public async remapProduct(stockId: string) {
    const token = await this.getToken();
    const res = await fetch(`${LD_API_URL}/v2/stocks/${stockId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw Object.assign(new Error("Product not found in Luxury Distribution"), { status: 404 });
    }
    const data = await res.json() as any;
    const ld = data.data;

    this.assertMappingsComplete(await this.computeUnmapped(ld));

    const variants = await this.buildVariants(ld);
    const tags = await this.buildTags(ld);
    const updated = await Product.findOneAndUpdate(
      { source: "luxury_distribution", external_id: stockId },
      { variants, is_combination: variants.length > 0, tags },
      { new: true }
    );
    if (!updated) throw Object.assign(new Error("Product not imported"), { status: 404 });
    return updated;
  }

  public async syncAll(): Promise<{ total: number; success: number; failed: number; errors: { stockId: string; error: string }[] }> {
    const products = await Product.find({ source: "luxury_distribution" }, { external_id: 1 }).lean() as any[];
    const result = { total: products.length, success: 0, failed: 0, errors: [] as { stockId: string; error: string }[] };
    for (const p of products) {
      try {
        await this.syncProduct(String(p.external_id));
        result.success++;
      } catch (err: any) {
        result.failed++;
        result.errors.push({ stockId: String(p.external_id), error: err.message });
      }
    }
    return result;
  }

  public async remapAll(): Promise<{ total: number; success: number; failed: number; errors: { stockId: string; error: string }[] }> {
    const products = await Product.find({ source: "luxury_distribution" }, { external_id: 1 }).lean() as any[];
    const result = { total: products.length, success: 0, failed: 0, errors: [] as { stockId: string; error: string }[] };
    for (const p of products) {
      try {
        await this.remapProduct(String(p.external_id));
        result.success++;
      } catch (err: any) {
        result.failed++;
        result.errors.push({ stockId: String(p.external_id), error: err.message });
      }
    }
    return result;
  }

  private async computeUnmapped(ld: any): Promise<{
    unmapped_sizes: string[];
    unmapped_color: string | null;
    unmapped_tags: string[];
  }> {
    const [attrMappings, tagMappings] = await Promise.all([
      LdAttributeMapping.find().select("ld_value").lean() as Promise<any[]>,
      LdTagMapping.find().select("ld_tag").lean() as Promise<any[]>,
    ]);

    const mappedLdValues = new Set(attrMappings.map((m: any) => m.ld_value));
    const mappedLdTags = new Set(tagMappings.map((m: any) => m.ld_tag));

    const sizes: string[] = (ld.size_quantity || []).map((o: any) => Object.keys(o)[0]);
    const unmapped_sizes = sizes.filter((s: string) => !mappedLdValues.has(s));

    const colorKey = ld.color_detail ? `color::${ld.color_detail}` : null;
    const unmapped_color = colorKey && !mappedLdValues.has(colorKey) ? ld.color_detail : null;

    const rawTags: string[] = [
      ...(ld.products_tags || []),
      ld.gender?.name,
    ].filter(Boolean).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
    const unmapped_tags = rawTags.filter((t: string) => !mappedLdTags.has(t));

    return { unmapped_sizes, unmapped_color, unmapped_tags };
  }

  private assertMappingsComplete(unmapped: {
    unmapped_sizes: string[];
    unmapped_color: string | null;
    unmapped_tags: string[];
  }): void {
    const { unmapped_sizes, unmapped_tags } = unmapped;
    if (unmapped_sizes.length === 0 && unmapped_tags.length === 0) return;

    const parts: string[] = [];
    if (unmapped_sizes.length > 0) parts.push(`tailles: ${unmapped_sizes.join(", ")}`);
    if (unmapped_tags.length > 0) parts.push(`tags: ${unmapped_tags.join(", ")}`);

    throw Object.assign(
      new Error(`Mappings manquants — ${parts.join(" | ")}`),
      { status: 422 }
    );
  }

  public async getLdAttributeValues(force = false): Promise<{ sizes: string[]; colors: string[] }> {
    if (!force) {
      const cached = await LdScanCache.findOne({ key: "attribute_values" }).lean() as any;
      if (cached && Date.now() - new Date(cached.cached_at).getTime() < LD_CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const token = await this.getToken();
    const pageSize = 200;
    const sizeSet = new Set<string>();
    const colorSet = new Set<string>();

    const firstRes = await fetch(`${LD_API_URL}/v2/stocks?offset=0&limit=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!firstRes.ok) throw Object.assign(new Error("Failed to fetch LD products"), { status: 502 });
    const firstData = await firstRes.json() as any;
    const total: number = firstData.data?.total || 0;
    const firstProducts: any[] = firstData.data?.data || [];

    const collect = (products: any[]) => {
      for (const p of products) {
        for (const sizeObj of p.size_quantity || []) {
          const key = Object.keys(sizeObj)[0];
          if (key) sizeSet.add(key);
        }
        if (p.color_detail) colorSet.add(p.color_detail);
      }
    };
    collect(firstProducts);

    const remaining = total - pageSize;
    if (remaining > 0) {
      const pages = Math.ceil(remaining / pageSize);
      await Promise.all(
        Array.from({ length: pages }, (_, i) =>
          fetch(`${LD_API_URL}/v2/stocks?offset=${(i + 1) * pageSize}&limit=${pageSize}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((r) => r.json() as Promise<any>)
            .then((d: any) => collect(d.data?.data || []))
        )
      );
    }

    const sort = (set: Set<string>) =>
      [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    const result = { sizes: sort(sizeSet), colors: sort(colorSet) };
    await LdScanCache.findOneAndUpdate(
      { key: "attribute_values" },
      { data: result, cached_at: new Date() },
      { upsert: true }
    );
    return result;
  }

  public async getLdTags(force = false): Promise<string[]> {
    if (!force) {
      const cached = await LdScanCache.findOne({ key: "tags" }).lean() as any;
      if (cached && Date.now() - new Date(cached.cached_at).getTime() < LD_CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const token = await this.getToken();
    const pageSize = 200;
    const tagSet = new Set<string>();

    const firstRes = await fetch(`${LD_API_URL}/v2/stocks?offset=0&limit=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!firstRes.ok) throw Object.assign(new Error("Failed to fetch LD products"), { status: 502 });
    const firstData = await firstRes.json() as any;
    const total: number = firstData.data?.total || 0;
    const firstProducts: any[] = firstData.data?.data || [];

    const collect = (products: any[]) => {
      for (const p of products) {
        for (const tag of p.products_tags || []) { if (tag) tagSet.add(tag); }
        if (p.gender?.name) tagSet.add(p.gender.name);
      }
    };
    collect(firstProducts);

    const remaining = total - pageSize;
    if (remaining > 0) {
      const pages = Math.ceil(remaining / pageSize);
      await Promise.all(
        Array.from({ length: pages }, (_, i) =>
          fetch(`${LD_API_URL}/v2/stocks?offset=${(i + 1) * pageSize}&limit=${pageSize}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((r) => r.json() as Promise<any>)
            .then((d: any) => collect(d.data?.data || []))
        )
      );
    }

    const result = [...tagSet].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    await LdScanCache.findOneAndUpdate(
      { key: "tags" },
      { data: result, cached_at: new Date() },
      { upsert: true }
    );
    return result;
  }

  public async validateImport(stockId: string): Promise<{
    unmapped_sizes: string[];
    unmapped_color: string | null;
    unmapped_tags: string[];
  }> {
    const token = await this.getToken();
    const res = await fetch(`${LD_API_URL}/v2/stocks/${stockId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw Object.assign(new Error("Product not found in Luxury Distribution"), { status: 404 });
    }
    const data = await res.json() as any;
    return this.computeUnmapped(data.data);
  }

  public async getImportedProduct(stockId: string) {
    const product = await Product.findOne({
      source: "luxury_distribution",
      external_id: stockId,
    }).lean();
    if (!product) throw Object.assign(new Error("Product not imported"), { status: 404 });
    return product;
  }

  public async getTagMappings() {
    return LdTagMapping.find().populate("eluxe_tag_id", "name _id").lean();
  }

  public async saveTagMappings(
    mappings: { ld_tag: string; eluxe_tag_id: string | null }[]
  ) {
    const ops = mappings.map(({ ld_tag, eluxe_tag_id }) => {
      if (!eluxe_tag_id) {
        return { deleteOne: { filter: { ld_tag } } };
      }
      return {
        updateOne: {
          filter: { ld_tag },
          update: { $set: { eluxe_tag_id } },
          upsert: true,
        },
      };
    });
    if (ops.length === 0) return { ok: true };
    return LdTagMapping.bulkWrite(ops as any[]);
  }

  private async mapProduct(ld: any, categoryId: string) {
    const slug = `${ld.name || "product"}-${ld.id}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const [variants, tags] = await Promise.all([
      this.buildVariants(ld),
      this.buildTags(ld),
    ]);
    const retailPrice = parseFloat(ld.original_price) || 0;
    const purchaseCost = parseFloat(ld.selling_price) || 0;

    const rawDesc = (ld.description || "").trim();
    const lines = rawDesc.split("\n").map((l: string) => l.trim()).filter(Boolean);
    const shortDescEn = (lines.length > 1 ? lines : rawDesc.match(/[^.!?]+[.!?]+/g) || [rawDesc])
      .slice(0, 5)
      .join(lines.length > 1 ? "\n" : " ")
      .trim();

    const categoryHierarchy = await this.getCategoryHierarchy(categoryId);

    const sizeAndFitEn = ld.size_and_fit ? ld.size_and_fit.replace(/&nbsp;/g, " ").trim() : "";
    const seasonEn = [ld.season_one?.name, ld.season_two?.name].filter(Boolean).join(" - ");

    const [
      nameFr, descriptionFr, shortDescFr,
      colorFr, madeinFr, materialFr, sizeInfoFr, sizeAndFitFr, genderFr, seasonFr,
    ] = await Promise.all([
      this.translateText(ld.name || "", "en", "fr"),
      this.translateText(ld.description || "", "en", "fr"),
      this.translateText(shortDescEn, "en", "fr"),
      this.translateText(ld.color_detail || "", "en", "fr"),
      this.translateText(ld.made_in || "", "en", "fr"),
      this.translateText(ld.material || "", "en", "fr"),
      this.translateText(ld.size_info || "", "en", "fr"),
      this.translateText(sizeAndFitEn, "en", "fr"),
      this.translateText(ld.gender?.name || "", "en", "fr"),
      this.translateText(seasonEn, "en", "fr"),
    ]);

    return {
      source: "luxury_distribution",
      external_id: String(ld.id),
      external_sku: ld.sku,
      last_synced_at: new Date(),
      sku: `LD-${ld.sku}`,
      barcode: ld.ean || undefined,
      name: ld.name,
      title: { en: ld.name || "", fr: nameFr },
      slug,
      brand: ld.brand,
      description: { en: ld.description || "", fr: descriptionFr },
      short_description: { en: shortDescEn, fr: shortDescFr },
      image: ld.images || [],
      prices: {
        original_price: retailPrice,
        price: retailPrice,
        purchase_cost: purchaseCost,
      },
      current_stock: ld.qty || 0,
      initial_stock: ld.qty || 0,
      category: categoryId,
      categories: categoryHierarchy,
      is_combination: variants.length > 0,
      variants,
      tags,
      translations: {
        ...(ld.year           && { year: ld.year }),
        ...(ld.color_detail   && { color: { en: ld.color_detail, fr: colorFr } }),
        ...(ld.color_supplier && { color_supplier: ld.color_supplier }),
        ...(ld.made_in        && { made_in: { en: ld.made_in, fr: madeinFr } }),
        ...(ld.material       && { material: { en: ld.material, fr: materialFr } }),
        ...(ld.size_info      && { size_info: { en: ld.size_info, fr: sizeInfoFr } }),
        ...(sizeAndFitEn      && { size_and_fit: { en: sizeAndFitEn, fr: sizeAndFitFr } }),
        ...(ld.gender?.name   && { gender: { en: ld.gender.name, fr: genderFr } }),
        ...(seasonEn          && { season: { en: seasonEn, fr: seasonFr } }),
        ...(ld.hs_code        && { hs_code: ld.hs_code }),
      },
      status: (ld.qty || 0) > 0 ? "show" : "hide",
      featured: false,
      promotional: false,
      rating: 0,
      num_reviews: 0,
      reviews: [],
    };
  }
}

export default new LuxuryDistributionService();
