import { Request } from "express";
import Category from "../category/category.model";
import Tag from "../tag/tag.model";
import Product from "./product.model";
import * as jsonpatch from "fast-json-patch";
import ProductType from "./product.type";
import languageCodes from "../../../resources/data/data";
import mongoose, { Types } from "mongoose";
import Attribute from "../attribute/attribute.model";
import { startOfMonth, endOfMonth } from "date-fns";
import * as bizSdk from "facebook-nodejs-business-sdk";
import facebookConfig from "../../../config/facebook";
import config from "../../../config/environment";
import associatedCostsService from "../associated-costs/associated-costs.service";
import profitGridService from "../profit-grid/profit-grid.service";
import exchangeRateService from "../exchange-rate/exchange-rate.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-06-21
 *
 * Class ProductService
 */
class ProductService {
  /**
   * Show products details by filter
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-21
   *
   * @param {Request} req the http request
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public showProductsByFilter(req: Request): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const lang = req.params.lang as string;
          const page: number = Number(req.query.page) || 1;
          const pageSize: number = Number(req.query.perPage) || 12;

          const name: string = (req.query.name as string) || "";
          const startDateParam = (req.query.startDate as string) || "";
          const endDateParam = (req.query.endDate as string) || "";
          const user: string = (req.query.user as string) || "";
          const featured: string = (req.query.featured as string) || "";
          const promotional: string = (req.query.promotional as string) || "";
          const status: string = (req.query.status as string) || "";
          const categories: string[] = req.query.categories
            ? (req.query.categories as string[])
            : [];
          const brands: string[] = req.query.brands
            ? (req.query.brands as string[])
            : [];
          const colors: string[] = req.query.colors
            ? (req.query.colors as string[])
            : [];
          const vendor: string = (req.query.vendor as string) || "";
          const order: string = (req.query.order as string) || "";
          const min: number = req.query.min ? Number(req.query.min) : 0;
          const max: number = req.query.max ? Number(req.query.max) : 0;
          const rating: number = req.query.rating
            ? Number(req.query.rating)
            : 0;

          let startDateFilter = {};
          let endDateFilter = {};

          if (startDateParam) {
            const startDate = new Date(startDateParam);
            startDate.setHours(0, 0, 0, 0); // Début de journée (00:00:00)
            startDateFilter = { $gte: startDate };
          }

          if (endDateParam) {
            const endDate = new Date(endDateParam);
            endDate.setHours(23, 59, 59, 999); // Fin de journée (23:59:59.999)
            endDateFilter = { $lte: endDate };
          }

          // Fetch category and tag data in parallel
          const [category, tag] = await Promise.all([
            req.query.category
              ? Category.findById(req.query.category as string)
              : null,
            req.query.tag
              ? Tag.findOne({ slug: req.query.tag as string })
              : null,
          ]);

          // Fetch color attributes if colors are provided in the filter
          const colorAttributes = colors.length
            ? await Attribute.find(
                {
                  $or: [
                    {
                      "variants.name.en": {
                        $in: colors.map((c) => new RegExp(`^${c}$`, "i")),
                      },
                    },
                    {
                      "variants.name.fr": {
                        $in: colors.map((c) => new RegExp(`^${c}$`, "i")),
                      },
                    },
                  ],
                  status: "show",
                },
                { _id: 1, name: 1, variants: 1 }
              )
            : [];

          const colorAttributeKeys = colorAttributes.map((item) =>
            item._id.toString()
          );

          // Extract variant IDs based on color names
          const variantIds = colorAttributes.flatMap((attribute) =>
            attribute.variants
              .filter(
                (variant) =>
                  colors.includes(variant.name.en) ||
                  colors.includes(variant.name.fr)
              )
              .map((variant) => variant._id?.toString())
          );

          // Recherche des tags liés au nom saisi
          let tagIdsFromSearch: string[] = [];
          if (name) {
            const matchingTags = await Tag.find(
              {
                $or: [{ [`name.${lang}`]: { $regex: name, $options: "i" } }],
              },
              "_id"
            );

            tagIdsFromSearch = matchingTags.map((tag) => tag._id.toString());
          }

          // Recherche des catégories liées au nom saisi
          let categoryIdsFromSearch: string[] = [];
          if (name) {
            const matchingCategories = await Category.find(
              {
                $or: [{ [`name.${lang}`]: { $regex: name, $options: "i" } }],
              },
              "_id"
            );

            categoryIdsFromSearch = matchingCategories.map((cat) =>
              cat._id.toString()
            );
          }

          const combinedCategoryIds = [
            ...(category ? [new Types.ObjectId(category._id)] : []),
            ...categoryIdsFromSearch.map((id) => new Types.ObjectId(id)),
            ...categories.map((id) => new Types.ObjectId(id)),
          ];

          const filter = {
            ...(vendor ? { vendor } : {}),
            ...(name
              ? {
                  $or: [
                    { [`title.${lang}`]: { $regex: name, $options: "i" } },
                    {
                      [`description.${lang}`]: { $regex: name, $options: "i" },
                    },
                    {
                      [`short_description.${lang}`]: {
                        $regex: name,
                        $options: "i",
                      },
                    },
                    { name: { $regex: name, $options: "i" } },
                  ],
                }
              : {}),
            ...(featured ? { featured: { $gte: featured } } : {}),
            ...(promotional ? { promotional: { $gte: promotional } } : {}),
            ...(min || max
              ? {
                  "prices.original_price": {
                    ...(min ? { $gte: min } : {}),
                    ...(max > 0 ? { $lte: max } : {}),
                  },
                }
              : {}),
            ...(rating ? { rating: { $gte: rating } } : {}),
            ...(combinedCategoryIds.length
              ? { categories: { $in: combinedCategoryIds } }
              : {}),
            ...(brands.length
              ? {
                  $expr: {
                    $in: [
                      { $toLower: "$brand" },
                      brands.map((b) => b.toLowerCase()),
                    ],
                  },
                }
              : {}),
            ...(colors.length
              ? {
                  variants: {
                    $elemMatch: {
                      // Filtrage des variantes qui ont une couleur correspondante
                      // Vous devrez probablement faire en sorte que la clé dynamique soit trouvée
                      $or: colorAttributeKeys.map((colorKey) => ({
                        [colorKey.toString()]: { $in: variantIds },
                      })),
                    },
                  },
                }
              : {}),
            ...(tag || tagIdsFromSearch.length
              ? {
                  tags: {
                    $in: [tag?._id, ...tagIdsFromSearch].filter(Boolean),
                  },
                }
              : {}),
            ...(user ? { user: user } : {}),
            ...(startDateParam || endDateParam
              ? {
                  created_at: {
                    ...startDateFilter,
                    ...endDateFilter,
                  },
                }
              : {}),
            ...(status === "published"
              ? { status: "show" }
              : status === "unPublished"
              ? { status: "hide" }
              : status === "status-selling"
              ? { current_stock: { $gt: 0 } }
              : status === "status-out-of-stock"
              ? { current_stock: { $lt: 1 } }
              : {}),
          };

          let products;
          let count;

          if (order === "lowest" || order === "highest") {
            // Pipeline d'agrégation amélioré
            const aggregationPipeline: any[] = [
              // Étape 1: Appliquer le filtre de base
              { $match: filter },

              // Étape 2: Préparer les données de prix
              {
                $addFields: {
                  // Vérifier si le produit a des variants
                  hasVariants: { $gt: [{ $size: "$variants" }, 0] },

                  // Prix de base (promo ou original)
                  basePriceValue: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$promotional", true] },
                          { $gt: ["$date_to_promo", new Date()] },
                        ],
                      },
                      { $toDouble: "$prices.price" },
                      { $toDouble: "$prices.original_price" },
                    ],
                  },

                  // Prix du premier variant (si existe)
                  firstVariantPriceValue: {
                    $let: {
                      vars: {
                        firstVar: {
                          $ifNull: [{ $arrayElemAt: ["$variants", 0] }, {}],
                        },
                      },
                      in: {
                        $cond: [
                          { $gt: [{ $toDouble: "$$firstVar.price" }, 0] },
                          { $toDouble: "$$firstVar.price" },
                          { $toDouble: "$$firstVar.original_price" },
                        ],
                      },
                    },
                  },
                },
              },

              // Étape 3: Calculer le prix final
              {
                $addFields: {
                  finalPrice: {
                    $cond: [
                      { $gt: ["$basePriceValue", 0] },
                      "$basePriceValue",
                      {
                        $cond: [
                          {
                            $and: [
                              { $eq: ["$hasVariants", true] },
                              { $gt: ["$firstVariantPriceValue", 0] },
                            ],
                          },
                          "$firstVariantPriceValue",
                          0,
                        ],
                      },
                    ],
                  },
                },
              },

              // Étape 4: Filtrer selon min/max (si spécifiés)
              {
                $match: {
                  $expr: {
                    $and: [
                      ...(min ? [{ $gte: ["$finalPrice", min] }] : []),
                      ...(max > 0 ? [{ $lte: ["$finalPrice", max] }] : []),
                    ],
                  },
                },
              },

              // Étape 5: Trier les résultats
              {
                $sort: {
                  finalPrice: order === "highest" ? -1 : 1,
                  _id: 1,
                },
              },

              // Étape 6: Pagination
              { $skip: (page - 1) * pageSize },
              { $limit: pageSize },

              // Étape 7: Peuplement des relations
              {
                $lookup: {
                  from: "categories",
                  localField: "categories",
                  foreignField: "_id",
                  as: "categories",
                },
              },
              {
                $lookup: {
                  from: "tags",
                  localField: "tags",
                  foreignField: "_id",
                  as: "tags",
                },
              },
            ];

            // Exécuter en parallèle
            const [aggregationResult, totalCount] = await Promise.all([
              Product.aggregate(aggregationPipeline),
              Product.countDocuments(filter),
            ]);

            products = aggregationResult;
            count = totalCount;
          } else {
            // Gestion des autres tris (inchangée)
            const sortOrder = this.getSortOrder(order);
            count = await Product.countDocuments(filter);
            products = await Product.find(filter)
              .populate("categories", "_id name slug")
              .populate("category", "_id name slug")
              .populate("tags", "name slug")
              .sort(sortOrder)
              .skip(pageSize * (page - 1))
              .limit(pageSize)
              .lean();
          }

          // Group variants for each product
          products.forEach((product: any) => {
            if (product.variants) {
              // Add grouped variants to the product object
              product.grouped_variants = this.groupVariantsByKeys(
                product.variants
              );
            }
          });

          resolve({
            products,
            previousPage: page > 1 ? page - 1 : null,
            perPage: pageSize,
            allProducts: count,
            currentPage: page,
            pages: Math.ceil(count / pageSize),
            nextPage: page < Math.ceil(count / pageSize) ? page + 1 : null,
          });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * get all products shown
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @return {Promise<any>} the eventual completion or failure
   */
  public getShowingProducts(): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const products = await Product.find({ status: "show" }).sort({
            _id: -1,
          });

          resolve(products);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get Best Sellers Of Month.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-02-21
   *
   * @return {Promise<any>} the eventual completion or failure
   */
  public getBestSellersOfMonth(): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const startDate = startOfMonth(new Date());
          const endDate = endOfMonth(new Date());

          const bestSellers = await Product.find({
            updated_at: { $gte: startDate, $lte: endDate },
            sales_count: { $gt: 0 }, // Exclure les produits sans ventes
          })
            .sort({ sales_count: -1 }) // Trier par nombre de ventes décroissant
            .limit(10)
            .lean();

          resolve(bestSellers);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get showing store products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {string} category - The product default category.
   * @param {string} title - The product title.
   * @param {string} slug - The product slug.
   * @return {Promise<any>} the eventual completion or failure
   */
  public getShowingStoreProducts(
    category: string,
    title: string,
    slug: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const queryObject: any = { status: "show" };

          if (category) {
            queryObject.categories = {
              $in: [category],
            };
          }

          if (title) {
            const titleQueries = languageCodes.map((lang) => ({
              [`title.${lang}`]: { $regex: `${title}`, $options: "i" },
            }));

            queryObject.$or = titleQueries;
          }
          if (slug) {
            queryObject.slug = { $regex: slug, $options: "i" };
          }

          let products: any = [];
          let popularProducts: any = [];
          let discountedProducts: any = [];
          let relatedProducts: any = [];

          if (slug) {
            products = await Product.find(queryObject)
              .populate({ path: "category", select: "name _id" })
              .sort({ _id: -1 })
              .limit(100);
            relatedProducts = await Product.find({
              category: products[0]?.category,
            }).populate({ path: "category", select: "_id name" });
          } else if (title || category) {
            products = await Product.find(queryObject)
              .populate({ path: "category", select: "name _id" })
              .sort({ _id: -1 })
              .limit(100);
          } else {
            popularProducts = await Product.find({ status: "show" })
              .populate({ path: "category", select: "name _id" })
              .sort({ sales: -1 })
              .limit(20);

            discountedProducts = await Product.find({
              status: "show", // Ensure status "show" for discounted products
              $or: [
                {
                  $and: [
                    { isCombination: true },
                    {
                      variants: {
                        $elemMatch: {
                          discount: { $gt: "0.00" },
                        },
                      },
                    },
                  ],
                },
                {
                  $and: [
                    { isCombination: false },
                    {
                      $expr: {
                        $gt: [
                          { $toDouble: "$prices.discount" }, // Convert the discount field to a double
                          0,
                        ],
                      },
                    },
                  ],
                },
              ],
            })
              .populate({ path: "category", select: "name _id" })
              .sort({ _id: -1 })
              .limit(20);
          }

          resolve({
            products,
            popularProducts,
            relatedProducts,
            discountedProducts,
          });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all brands
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @return {Promise<any>} the eventual completion or failure
   */
  public getAllBrands(): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const brands = await Product.aggregate([
            {
              $match: {
                brand: { $ne: "" },
              },
            },
            {
              $project: {
                brand: {
                  $trim: {
                    input: { $toLower: "$brand" },
                  },
                },
              },
            },
            {
              $group: {
                _id: "$brand",
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ]);

          const cleanedBrands: string[] = brands
            .map((b) => b._id?.trim())
            .filter((b) => !!b)
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1));

          resolve(cleanedBrands);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-24
   *
   * @param {any} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product = new Product({
            ...data,
            name: data.title.en || data.title.fr,
            // productId: cname + (count + 1),
            product_id: data.product_id
              ? data.product_id
              : new mongoose.Types.ObjectId(),
          });

          const createdProduct: any = await product.save();

          if (config.env === "production") {
            await this.syncProductToFacebook(createdProduct);
          }

          resolve(createdProduct);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a review
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-10-08
   *
   * @param {string} productId the product id
   * @param {any} data the update object
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async createReview(productId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product = await Product.findById(productId);

          if (product) {
            let updatedProduct: any = null;
            const review = {
              name: data.name,
              email: data.email,
              rating: Number(data.rating),
              comment: data.comment,
            };

            if (product.reviews.find((x: any) => x.email === data.email)) {
              product.reviews.map((x: any) => {
                if (x.email === data.email) {
                  x.rating = review.rating;
                  x.comment = review.comment;
                }
              });

              updatedProduct = await product.save();
            } else {
              product.reviews.push(review);
              product.num_reviews = product.reviews.length;
              product.rating =
                product.reviews.reduce((a: any, c: any) => c.rating + a, 0) /
                product.reviews.length;

              updatedProduct = await product.save();
            }

            resolve(updatedProduct);
          } else {
            resolve(product);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create multiple products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-22
   *
   * @param {Array<ProductType>} data the data relating to the product to be stored.
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMultiple(data: Array<ProductType>): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const createdProducts: any = await Product.insertMany(data);
          resolve(createdProducts);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get product details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-24
   *
   * @param {string} productId the product's id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public showProductById(productId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product: any = await Product.findById(productId)
            .populate("categories", "_id name")
            .populate("tags", "name slug")
            .populate("category", "_id name")
            .populate("upsells")
            .populate("cross_sells")
            .populate("related_products")
            .populate({
              path: "extras",
              populate: [
                {
                  path: "group_items",
                  model: "product",
                },
                {
                  path: "related_product",
                  model: "product",
                },
              ],
            })
            .lean(); // Convert the document to a plain object

          if (product && product.variants) {
            // Grouping logic for the product variants
            // const groupedVariants = product.variants.reduce(
            //   (acc: any, variant: any) => {
            //     const uniqueKey = Object.keys(variant).find(
            //       (key) => key.length === 24
            //     ); // Adjust the condition if key length is different
            //     if (uniqueKey) {
            //       if (!acc[uniqueKey]) {
            //         acc[uniqueKey] = [];
            //       }
            //       acc[uniqueKey].push(variant);
            //     }
            //     return acc;
            //   },
            //   {}
            // );
            const groupedVariants = this.groupVariantsByKeys(product.variants);

            // Add the grouped variants to the product object for easier access
            product.grouped_variants = groupedVariants;
          }

          resolve(product);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get product by slug
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {string} productSlug the product's slug.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getProductBySlug(productSlug: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product = await Product.findOne({ slug: productSlug })
            .populate("categories", "name slug")
            .populate("tags", "name slug")
            .populate("related_products");

          resolve(product);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Assign a category to a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {string} productId the product id
   * @param {string} categoryId the category id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public assignToCategory(
    productId: string,
    categoryId: string
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product: any = await Product.findById(productId);

          if (product) {
            const category: any = await Category.findById(categoryId);

            if (category) {
              // Check if the product doesn't already have this category
              if (product.categories.includes(category._id))
                resolve("ALREADY_ASSIGNED");
              else {
                product.categories = [...product.categories, category._id];
                await product.save();

                category.products = [...category.products, product._id];
                await category.save();
              }

              resolve(product);
            } else {
              resolve("CATEGORY_NOT_FOUND");
            }
          } else {
            resolve("PRODUCT_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Unassign a category to a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {string} productId the product id
   * @param {string} categoryId the category id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public unassignFromCategory(
    productId: string,
    categoryId: string
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product: any = await Product.findById(productId);

          if (product) {
            const category: any = await Category.findById(categoryId);

            if (category) {
              // Check if the product have this category
              if (!product.categories.includes(category._id))
                resolve("NOT_HAVE_THIS_CATERY");
              else {
                product.categories = product.categories.filter(
                  (x: any) => x.toString() != category._id.toString()
                );

                await product.save();

                category.products = category.products.filter(
                  (x: any) => x.toString() != product._id.toString()
                );

                await category.save();
              }

              resolve(product);
            } else {
              resolve("CATEGORY_NOT_FOUND");
            }
          } else {
            resolve("PRODUCT_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Assign a tag to a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {string} productId the product id
   * @param {string} tagId the tag id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public assignToTag(productId: string, tagId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product: any = await Product.findById(productId);

          if (product) {
            const tag: any = await Tag.findById(tagId);

            if (tag) {
              // Check if the product doesn't already have this tag
              if (product.tags.includes(tag._id)) resolve("ALREADY_ASSIGNED");
              else {
                product.tags = [...product.tags, tag._id];
                await product.save();

                tag.products = [...tag.products, product._id];
                await tag.save();
              }

              resolve(product);
            } else {
              resolve("TAG_NOT_FOUND");
            }
          } else {
            resolve("PRODUCT_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Unassign a tag to a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {string} productId the product id
   * @param {string} tagId the tag id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public unassignFromTag(productId: string, tagId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product: any = await Product.findById(productId);

          if (product) {
            const tag: any = await Tag.findById(tagId);

            if (tag) {
              // Check if the product have this tag
              if (!product.tags.includes(tag._id)) resolve("NOT_HAVE_THIS_TAG");
              else {
                product.tags = product.tags.filter(
                  (x: any) => x.toString() != tag._id.toString()
                );

                await product.save();

                tag.products = tag.products.filter(
                  (x: any) => x.toString() != product._id.toString()
                );

                await tag.save();
              }

              resolve(product);
            } else {
              resolve("TAG_NOT_FOUND");
            }
          } else {
            resolve("PRODUCT_NOT_FOUND");
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Calculate the final price of a product based on its associated costs and profit grid.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {string[]} costIds - Array of cost IDs associated with the product.
   * @param {string} targetCurrency - The target currency for the final price (default is "USD").
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async calculateFinalPrice(costIds: string[], targetCurrency = "USD"): Promise<unknown> {
    // 1. Calcul des coûts totaux
    const costs: any = await associatedCostsService.getAllByIds(costIds);
    const totalCostEUR = costs.reduce((sum: number, cost: any) => sum + cost.amount, 0);

    // 2. Calcul du bénéfice
    const { gross_profit: grossProfit }: any = await profitGridService.calculateProfit(totalCostEUR);

    // 3. Conversion de devise
    const conversion: any = await exchangeRateService.convert(
      totalCostEUR + grossProfit,
      "EUR",
      targetCurrency
    );

    return {
      totalCostEUR,
      grossProfit,
      finalPrice: conversion.convertedAmount,
      conversionDetails: conversion
    };
  }

  /**
   * Update a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {string} productId the product id.
   * @param {any} data the product data.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(productId: string, data: ProductType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product = await Product.findById(productId);
          // console.log("product", product);

          if (product) {
            product.title = { ...product.title, ...data.title };
            product.short_description = {
              ...product.short_description,
              ...data.short_description,
            };
            product.description = {
              ...product.description,
              ...data.description,
            };

            product.product_id = data.product_id || product.product_id;
            product.sku = data.sku || product.sku;
            product.barcode = data.barcode;
            product.slug = data.slug || product.slug;
            product.categories = data.categories || product.categories;
            product.category = data.category || product.category;
            product.status = data.status || product.status;
            product.is_combination = data.is_combination;
            product.variants = data.variants;
            product.initial_stock = data.initial_stock;
            product.current_stock = data.current_stock;
            product.prices = data.prices;
            product.promotional = data.promotional;
            product.date_from_promo = data.date_from_promo;
            product.date_to_promo = data.date_to_promo;
            product.image = data.image;
            product.brand = data.brand;
            product.tags = data.tags;
            product.related_products = data.related_products;
            product.upsells = data.upsells;
            product.cross_sells = data.cross_sells;
            product.extras = data.extras;

            await product.save();

            if (config.env === "production") {
              await this.syncProductToFacebook(product as any);
            }

            resolve(product);
          } else {
            resolve(product);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update many products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {any} data the product data.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateMany(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const updatedData: any = {};
          for (const key of Object.keys(data)) {
            if (
              data[key] !== "[]" &&
              Object.entries(data[key]).length > 0 &&
              data[key] !== data.ids
            ) {
              // console.log('req.body[key]', typeof req.body[key]);
              updatedData[key] = data[key];
            }
          }

          // console.log("updated data", updatedData);

          const products = await Product.updateMany(
            { _id: { $in: data.ids.map((x: string) => x) } },
            {
              $set: updatedData,
            },
            {
              multi: true,
            }
          );

          resolve(products);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Patch a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-22
   *
   * @param {string} productId the product id
   * @param {any} data the update object
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async patch(productId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product = await Product.findById(productId);

          if (product) {
            const updateObject = jsonpatch.applyPatch(
              product.toObject(),
              data,
              false,
              true
            ).newDocument;

            await Product.updateOne({ _id: productId }, { $set: updateObject });

            resolve(updateObject);
          } else {
            resolve(product);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a product by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {string} productId the product id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(productId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const product: any = await Product.findById(productId);

          if (product) {
            const deleteProduct = await product.deleteOne();

            resolve(deleteProduct);
          } else {
            resolve(product);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Array<string>} productIds the product ids
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteMany(productIds: Array<string>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const deleteProducts = await Product.deleteMany({
            _id: { $in: productIds },
          });

          resolve(deleteProducts);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /*-----------------------------------------------------------------------------------------------
  //  PRIVATE METHODS
  -----------------------------------------------------------------------------------------------*/
  /**
   * Synchronizes a product with the Facebook catalog.
   * This function formats the product data according to Facebook's product feed specifications
   * and sends it to the Facebook catalog for listing.
   *
   * @author Valentin magde <valentinmagde@gmail.com>
   * @since 2025-04-03
   * @private
   * @async
   * @function
   * @param {Object} product - The product object containing details to be synchronized.
   * @param {string} product.sku - The unique SKU (Stock Keeping Unit) of the product.
   * @param {boolean} product.current_stock - Indicates if the product is in stock.
   * @param {string} product.description - The description of the product.
   * @param {string[]} product.image - Array of image URLs for the product.
   * @param {string} product._id - The slugified name of the product for URL generation.
   * @param {string} product.name - The name of the product.
   * @param {number} product.price - The price of the product in base currency (converted to cents).
   *
   * @throws {Error} Logs an error if synchronization with Facebook fails.
   *
   * @returns {Promise<void>} Resolves when the product is successfully synchronized.
   */
  private async syncProductToFacebook(product: {
    sku: string;
    current_stock: number;
    description: {
      en: string;
      fr: string;
    };
    image: string[];
    _id: string;
    title: {
      en: string;
      fr: string;
    };
    prices: {
      original_price: number;
      price: number;
    };
    is_promotional: boolean;
    brand: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const api = bizSdk.FacebookAdsApi.init(
            facebookConfig.accessToken as string
          );
          const ProductCatalog = bizSdk.ProductCatalog;

          const productData = {
            // id: product?.sku.toString() || product?._id.toString(),
            retailer_id: product?.sku.toString(),
            availability: product?.current_stock ? "in stock" : "out of stock",
            condition: "new",
            description: (
              product?.description?.en || product?.description?.fr
            )?.substring(0, 5000),
            image_url: product.image[0],
            url: `${config.storeUrl}/shop/${product._id}`,
            name: product?.title?.en || product?.title?.fr,
            price: Math.round(product?.prices?.original_price * 100),
            sale_price: product?.is_promotional
              ? Math.round(product?.prices?.price * 100)
              : null,
            currency: "USD",
            brand: product?.brand,
          };

          const catalog = new ProductCatalog(facebookConfig.catalogId, {
            api: api,
          });

          // Check if product exists
          const existingProducts: any = await catalog.getProducts(["id"], {
            filter: JSON.stringify({
              retailer_id: { eq: product?.sku.toString() },
            }),
          });

          let result: any = null;

          if (existingProducts[0]?.id) {
            // 2. Try to update existing product first
            result = await catalog.update([], {
              productData,
              update_mask: this.getUpdateMask(productData),
              force_refresh: true,
              timestamp: Math.floor(Date.now() / 1000),
            });

            resolve(result);
          } else {
            result = await catalog.createProduct([], productData);

            resolve(result);
          }
        } catch (error) {
          reject(
            `Failed to sync product to Facebook: ${this.formatFacebookError(
              error
            )}`
          );
        }
      })();
    });
  }

  /**
   * Generates a Facebook API update_mask string from the provided data object.
   * The update_mask specifies which fields should be updated, optimizing API payload.
   *
   *  @param {Record<string, any>} data - Key-value pairs of product data
   * @returns {string} Comma-separated list of fields to update (e.g., "price,availability")
   */
  private getUpdateMask(data: Record<string, any>): string {
    return Object.keys(data)
      .filter((key) => data[key] !== undefined)
      .join(",");
  }

  /**
   *  Extracts human-readable error message from Facebook API error objects.
   * Provides a fallback message when error format is unexpected.
   *
   * @param {any} error - Raw error object
   * @returns {string} User-friendly error message
   */
  private formatFacebookError(error: any): string {
    return (
      error?.response?.error?.error_user_msg ||
      error?.message ||
      "Unknown error"
    );
  }

  /**
   * Groups product variants by their ID keys (24-character keys)
   *
   * @author valentin Magde <valentinmagde@gmail.com>
   * @since 2025-05-01
   * @param {any[]} variants - Array of product variants to group
   * @returns {any[]} Array of grouped variants where each group is an object
   *          with the ID key as property and array of variants as value
   */
  private groupVariantsByKeys(variants: any[]): any[] {
    const result: any = {};

    // Trouver toutes les clés d'ID (24 caractères)
    const idKeys = Array.from(
      new Set(
        variants.flatMap((variant) =>
          Object.keys(variant).filter((key) => key.length === 24)
        )
      )
    );

    idKeys.map((idKey) => {
      const grouped: Record<string, any> = {};

      variants.forEach((variant) => {
        const keyValue = variant[idKey];
        if (!keyValue) return;

        if (!grouped[keyValue]) {
          grouped[keyValue] = { [idKey]: keyValue };
        }

        Object.keys(variant).forEach((key) => {
          if (key === idKey) return;

          const val = variant[key];
          if (val === undefined) return;

          if (!grouped[keyValue][key]) {
            if (key.length === 24) {
              grouped[keyValue][key] = [val];
            } else {
              grouped[keyValue][key] = val;
            }
          } else {
            if (key.length === 24) {
              if (!grouped[keyValue][key].includes(val)) {
                grouped[keyValue][key].push(val);
              }
            }
          }
        });
      });

      result[idKey] = Object.values(grouped);
    });
    return result;
  }

  /**
   * Returns the MongoDB sort criteria based on the requested order
   *
   * @param {string} order - The sorting option requested.
   * @returns {Object} MongoDB sort object
   */
  private getSortOrder(order: string): any {
    switch (order) {
      case "newest":
      case "date-added-desc":
        return { created_at: -1 };
      case "date-updated-asc":
        return { updated_at: 1 };
      case "date-updated-desc":
        return { updated_at: -1 };
      case "toprated":
        return { rating: -1 };
      case "popular":
        return { sales_count: -1 };
      default:
        return { _id: -1 };
    }
  }
}

const productService = new ProductService();
export default productService;
