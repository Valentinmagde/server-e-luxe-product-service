import mongoose from "mongoose";
import Product from "../product/product.model";
import Category from "./category.model";
import CategoryType from "./category.type";
import * as jsonpatch from "fast-json-patch";
import { removeDuplicates } from "../../utils/helpers.util";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-07-31
 *
 * Class CategoryService
 */
class CategoryService {
  /**
   * Get all products categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getCategories(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const categories = await Category.find()
            .sort({ _id: -1 })
            .populate("products", "_id name");

          resolve(categories);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all category parent and child
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getAllCategory(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const categories: Array<CategoryType> = await Category.find()
            .sort({ _id: -1 })
            .populate("products", "_id name");

          const categoryList =
            this.readyToParentAndChildrenCategory(categories);

          resolve(categoryList);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a category
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {CategoryType} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(data: CategoryType): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const category: any = new Category(data);
          const createdCategory = await category.save();

          resolve(createdCategory);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create many categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @param {Array<CategoryType>} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMany(data: Array<CategoryType>): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // await Category.deleteMany();

          const createdCategories: any = await Category.insertMany(data);

          resolve(createdCategories);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get category details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {string} categoryId the category's id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getCategoryById(categoryId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const category = await Category.findById(categoryId).populate(
            "products",
            "_id name"
          );

          resolve(category);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get showing categories details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingCategories(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const categories: any = await Category.find({ status: "show" }).sort({
            _id: -1,
          });

          const categoryList =
            this.readyToParentAndChildrenCategory(categories);

          resolve(categoryList);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get featured categories with product count
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-10-07
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getFeaturedCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const featuredCategories = await Category.aggregate([
            {
              $match: { is_top_category: true }, // Filter for featured categories
            },
            {
              $lookup: {
                from: "products", // Name of the Product collection
                localField: "_id", // Category _id field
                foreignField: "categories", // Categories field in Product schema
                as: "products", // The output array field containing matching products
              },
            },
            {
              $addFields: {
                productCount: { $size: "$products" }, // Count the number of products
              },
            },
            {
              $project: {
                name: 1,
                productCount: 1, // Include the category name and the count of products
                image: 1,
              },
            },
          ]);

          resolve(featuredCategories);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get categories with products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-10-14
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getCategoriesWithProducts(): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const baseCategories = await Product.aggregate([
            {
              // Décomposer le tableau de catégories dans chaque produit
              $unwind: "$categories",
            },
            {
              // Grouper les produits par catégorie
              $group: {
                _id: "$categories",
                count: { $sum: 1 }, // Compter les produits par catégorie
              },
            },
            {
              // Filtrer pour les catégories ayant au moins 1 produit
              $match: {
                count: { $gt: 0 },
              },
            },
            {
              // Lier avec les détails des catégories
              $lookup: {
                from: "categories", // Nom de la collection des catégories
                localField: "_id",
                foreignField: "_id",
                as: "categoryDetails",
              },
            },
            {
              // Déstructurer les résultats
              $unwind: "$categoryDetails",
            },
            {
              // Sélectionner les champs à afficher
              $project: {
                _id: "$_id",
                name: "$categoryDetails.name",
                parent_name: "$categoryDetails.parent_name",
                parent_id: "$categoryDetails.parent_id",
                product_count: "$count",
                isChecked: { $literal: false }, // Add 'isChecked' with a hardcoded value
              },
            },
          ]);

          // Récupération des ancêtres sans doublons
          const uniqueAncestors = new Map<string, any>();

          await Promise.all(
            baseCategories.map(async (category) => {
              const ancestors = await this.getAncestors(category._id);
              ancestors.forEach((ancestor) => {
                if (!uniqueAncestors.has(ancestor._id.toString())) {
                  uniqueAncestors.set(ancestor._id.toString(), ancestor);
                }
              });
            })
          );

          // Combinaison des résultats sans doublons
          const allCategories = removeDuplicates([
            ...baseCategories,
            ...Array.from(uniqueAncestors.values()),
          ]);

          resolve(this.readyToParentAndChildrenCategory(allCategories));
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a category
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-01-07
   *
   * @param {string} categoryId the category id
   * @param {any} data the category data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(categoryId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const category = await Category.findById(categoryId);

          if (category) {
            category.name = { ...category.name, ...data.name };
            category.description = {
              ...category.description,
              ...data.description,
            };
            category.slug = data.slug || category.slug;
            category.icon = data.icon || category.icon;
            category.image = data.image || category.image;
            category.status = data.status || category.status;
            category.parent_id = data.parent_id || category.parent_id;
            category.parent_name = data.parent_name;
            category.is_top_category =
              data.is_top_category || category.is_top_category;

            const updatedCategory = await category.save();

            resolve(updatedCategory);
          } else {
            resolve(category);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Patch a category
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-10-06
   *
   * @param {string} categoryId the category id
   * @param {any} data the update object
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async patch(categoryId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const category = await Category.findById(categoryId);

          if (category) {
            const updateObject = jsonpatch.applyPatch(
              category.toObject(),
              data,
              false,
              true
            ).newDocument;

            await Category.updateOne(
              { _id: categoryId },
              { $set: updateObject }
            );

            resolve(updateObject);
          } else {
            resolve(category);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update category status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-01-07
   *
   * @param {string} categoryId the category id
   * @param {any} data the category data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateStatus(categoryId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const category = await Category.findById(categoryId);

          if (category) {
            category.status = data.status;

            const updatedCategory = await category.save();

            resolve(updatedCategory);
          } else {
            resolve(category);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update many categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-01-07
   *
   * @param {any} data the categories data
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
              updatedData[key] = data[key];
            }
          }

          const updatedCategory = await Category.updateMany(
            { _id: { $in: data.ids } },
            {
              $set: updatedData,
            },
            {
              multi: true,
            }
          );

          resolve(updatedCategory);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a category by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {string} categoryId the category id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(categoryId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const category: any = await Category.findById(categoryId);

          if (category) {
            const deletedCategory = await category.deleteOne();

            resolve(deletedCategory);
          } else {
            resolve(category);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @param {Array<string>} categoryIds the category ids.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteMany(categoryIds: Array<string>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await Category.deleteMany({
            parent_id: categoryIds.map((item) => item),
          });
          const deletedCategory = await Category.deleteMany({
            _id: categoryIds.map((item) => item),
          });

          resolve(deletedCategory);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Ready to parent and children category
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @param {Array<CategoryType>} categories - The categories.
   * @param {string} parentId - The parent id.
   * @return {Array<CategoryType>} - The eventual completion or failure.
   */
  private readyToParentAndChildrenCategory(
    categories: Array<CategoryType>,
    parentId = ""
  ): Array<CategoryType> {
    const categoryList: Array<any> = [];
    let Categories;
    if (!parentId) {
      Categories = categories.filter((cat) => cat.parent_id == undefined);
    } else {
      Categories = categories.filter((cat) => cat.parent_id == parentId);
    }

    for (const cate of Categories) {
      categoryList.push({
        _id: cate._id,
        name: cate.name,
        parentId: cate.parent_id,
        parentName: cate.parent_name,
        description: cate.description,
        icon: cate.icon,
        status: cate.status,
        is_top_category: cate.is_top_category,
        image: cate.image,
        productCount: cate?.product_count || 0,
        isChecked: false,
        children: this.readyToParentAndChildrenCategory(categories, cate._id),
      });
    }

    return categoryList;
  }

  /**
   * Retrieves the chain of ancestor categories for a given category ID.
   *
   * This method performs a recursive lookup of the parent categories until it reaches
   * the top-level category (i.e., a category with no parent). Each ancestor is added
   * to the beginning of the `ancestors` array, resulting in an ordered list from root to immediate parent.
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-04-20
   * @param {string} categoryId - The ID of the category whose ancestors are to be retrieved.
   * @param {any[]} ancestors - (Optional) An accumulator array used during recursion to collect ancestor categories.
   * @returns {Promise<any[]>} A promise that resolves to an array of ancestor category objects,
   * each containing `_id` and `name`.
   */
  private async getAncestors(
    categoryId: string,
    ancestors: any[] = []
  ): Promise<any[]> {
    const category = await Category.findById(categoryId);
    if (!category || !category.parent_id) return ancestors;

    // 1. Conversion de l'ID en ObjectId
    const parentId = new mongoose.Types.ObjectId(category.parent_id);

    // 2. Récupère le parent avec le nombre de produits
    const parentWithProducts = await Product.aggregate([
      {
        $match: {
          categories: parentId,
        },
      },
      {
        $group: {
          _id: null,
          productCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          productCount: 1,
        },
      },
    ]);

    const parent: any = await Category.findById(category.parent_id);
    if (!parent) return ancestors;

    ancestors.unshift({
      _id: parent._id,
      name: parent.name,
      ...(parent.parent_id !== undefined && { parent_id: parent.parent_id }),
      ...(parent.parent_name !== undefined && { parent_name: parent.parent_name }),
      product_count: parentWithProducts[0]?.productCount || 0,
      isChecked: false,
    });

    return this.getAncestors(parent._id, ancestors);
  }
}

const categoryService = new CategoryService();
export default categoryService;
