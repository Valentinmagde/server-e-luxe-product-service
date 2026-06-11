const FB_GRAPH_URL = "https://graph.facebook.com/v21.0";
const FB_CATALOG_ID = process.env.FB_CATALOG_ID || "";
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || "";
const STORE_CURRENCY = process.env.STORE_CURRENCY || "EUR";
const WEB_CLIENT_URL = (process.env.WEB_CLIENT_URL || "").replace(/\/$/, "");

type Availability = "in stock" | "out of stock";

interface CatalogProduct {
  retailer_id: string;
  title: string;
  description: string;
  price: number;
  availability: Availability;
  image_url: string;
  product_url: string;
  brand?: string;
}

class FacebookCatalogService {
  private enabled(): boolean {
    return process.env.NODE_ENV === "production" && !!(FB_CATALOG_ID && FB_ACCESS_TOKEN);
  }

  private async batch(requests: object[]): Promise<void> {
    if (!this.enabled() || requests.length === 0) return;

    const res = await fetch(
      `${FB_GRAPH_URL}/${FB_CATALOG_ID}/items_batch?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_type: "PRODUCT_ITEM", requests }),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("[FacebookCatalog] batch error:", body);
    }
  }

  async upsert(product: CatalogProduct): Promise<void> {
    await this.batch([
      {
        method: "UPSERT",
        data: {
          id: product.retailer_id,
          title: product.title.slice(0, 200),
          description: (product.description || product.title).slice(0, 5000),
          availability: product.availability,
          condition: "new",
          price: `${product.price.toFixed(2)} ${STORE_CURRENCY}`,
          link: product.product_url,
          image_link: product.image_url,
          ...(product.brand && { brand: product.brand }),
        },
      },
    ]);
  }

  async updateAvailability(retailer_id: string, availability: Availability): Promise<void> {
    await this.batch([
      {
        method: "UPSERT",
        data: { id: retailer_id, availability },
      },
    ]);
  }

  async delete(retailer_id: string): Promise<void> {
    await this.batch([
      {
        method: "DELETE",
        data: { id: retailer_id },
      },
    ]);
  }

  buildRetailerId(externalId: string): string {
    return `LD-${externalId}`;
  }

  buildProductUrl(mongoId: string): string {
    return `${WEB_CLIENT_URL}/shop-details?id=${mongoId}`;
  }
}

export default new FacebookCatalogService();
