import Product from "../product/product.model";
import Attribute from "./attribute.model";
import AttributeType from "./attribute.type";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2024-07-20
 *
 * Class AttributeService
 */
class AttributeService {
  /**
   * Get all attributes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {any} query The query request.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public index(query: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { type, option, option1 } = query;
          const attributes = await Attribute.find({
            $or: [
              { type: type },
              { $or: [{ option: option }, { option: option1 }] },
            ],
          });

          resolve(attributes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all showing attributes test
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingAttributesTest(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attributes = await Attribute.find({ status: "show" });

          resolve(attributes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create an attribute
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {AttributeType} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(data: AttributeType): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute: any = new Attribute(data);
          const createdAttribute = await attribute.save();

          resolve(createdAttribute);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a child attribute
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute's id
   * @param {AttributeType} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeChild(
    attributeId: string,
    data: AttributeType
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute: any = await Attribute.findById(attributeId);

          if (attribute) {
            await Attribute.updateOne(
              { _id: attributeId },
              { $push: { variants: data } }
            );

            const createdAttribute: any = await Attribute.findById(
              attributeId
            ).select("variants");

            resolve(createdAttribute);
          } else {
            resolve(attribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create many attributes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Array<CategoryType>} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMany(data: Array<AttributeType>): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // await Attribute.deleteMany();

          const createdAttributes: any = await Attribute.insertMany(data);

          resolve(createdAttributes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get attribute details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute's id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public show(attributeId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute = await Attribute.findById(attributeId);

          resolve(attribute);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get child attribute details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute's id
   * @param {string} childAttributeId the child attribute's id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public showChild(
    attributeId: string,
    childAttributeId: string
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute: any = await Attribute.findOne({ _id: attributeId });

          if (attribute) {
            const childAttribute = attribute.variants.find(
              (attr: any) => attr._id == childAttributeId
            );
            resolve(childAttribute);
          } else {
            resolve(attribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get showing attributes details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingAttributes(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attributes = await Attribute.aggregate([
            {
              $match: {
                status: "show",
                "variants.status": "show",
              },
            },
            {
              $project: {
                _id: 1,
                status: 1,
                title: 1,
                name: 1,
                option: 1,
                type: 1,
                category: 1,
                createdAt: 1,
                updateAt: 1,
                variants: {
                  $filter: {
                    input: "$variants",
                    cond: {
                      $eq: ["$$this.status", "show"],
                    },
                  },
                },
              },
            },
          ]);

          resolve(attributes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update an attribute
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute id
   * @param {any} data the attribute data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(attributeId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute = await Attribute.findById(attributeId);

          if (attribute) {
            attribute.title = { ...attribute.title, ...data.title };
            attribute.name = { ...attribute.name, ...data.name };
            // attribute._id = attributeId;
            //attribute.title = req.body.title;
            // attribute.name = req.body.name;
            attribute.option = data.option;
            attribute.type = data.type;
            // attribute.category = data.category;
            // attribute.variants = req.body.variants;

            const updatedAttribute = await attribute.save();
            resolve(updatedAttribute);
          } else {
            resolve(attribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update child attribute
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute id
   * @param {string} childAttributeId the child attribute's id
   * @param {any} data the attribute data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateChild(
    attributeId: string,
    childAttributeId: string,
    data: any
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute = await Attribute.findById({
            _id: attributeId,
            "variants._id": childAttributeId,
          });

          if (attribute) {
            const att: any = attribute.variants.find(
              (v: any) => v._id.toString() === childAttributeId
            );

            const name = {
              ...att.name,
              ...data.name,
            };

            const description = {
              ...att.description,
              ...data.description,
            };

            const updatedAttribute = await Attribute.updateOne(
              { _id: attributeId, "variants._id": childAttributeId },
              {
                $set: {
                  "variants.$.name": name,
                  "variants.$.description": description,
                  "variants.$.color": data.color,
                  "variants.$.status": data.status,
                },
              }
            );

            resolve(updatedAttribute);
          } else {
            resolve(attribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update attribute status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute id
   * @param {any} data the category data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateStatus(attributeId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute = await Attribute.findById(attributeId);

          if (attribute) {
            attribute.status = data.status;

            const updatedAttribute = await attribute.save();

            resolve(updatedAttribute);
          } else {
            resolve(attribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update child attribute status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} childAttributeId the child attribute id
   * @param {any} data the category data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateChildStatus(
    childAttributeId: string,
    data: any
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const updatedAttribute = await Attribute.updateOne(
            { "variants._id": childAttributeId },
            {
              $set: {
                "variants.$.status": data.status,
              },
            }
          );

          resolve(updatedAttribute);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update many attributes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {any} data the categories data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateMany(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const updatedAttributes = await Attribute.updateMany(
            { _id: { $in: data.ids } },
            {
              $set: {
                option: data.option,
                status: data.status,
              },
            },
            {
              multi: true,
            }
          );

          resolve(updatedAttributes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update many child attributes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} currentId the current attribute id
   * @param {any} data the categories data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateChildMany(currentId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // select attribute value
          const childIdAttribute = await Attribute.findById(currentId);

          if (childIdAttribute) {
            const final = childIdAttribute.variants.filter((value) =>
              data.ids.find((value1: any) => value1 == value._id)
            );

            const updateStatusAttribute = final.map((value) => {
              value.status = data.status;
              return value;
            });

            // group attribute
            let totalVariants: Array<any> = [];
            if (data.changeId) {
              const groupIdAttribute: any = await Attribute.findById(
                data.changeId
              );
              totalVariants = [
                ...groupIdAttribute.variants,
                ...updateStatusAttribute,
              ];
            }

            if (totalVariants.length === 0) {
              await Attribute.updateOne(
                { _id: currentId },
                {
                  $set: {
                    variants: childIdAttribute.variants,
                  },
                },
                {
                  multi: true,
                }
              );
            } else {
              await Attribute.updateOne(
                { _id: data.changeId },
                {
                  $set: {
                    variants: totalVariants,
                  },
                },
                {
                  multi: true,
                }
              );

              await Attribute.updateOne(
                { _id: currentId },
                {
                  $pull: { variants: { _id: data.ids } },
                },
                {
                  multi: true,
                }
              );
            }
            resolve(childIdAttribute);
          } else {
            resolve(childIdAttribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete an attribute by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(attributeId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute: any = await Attribute.findById(attributeId);

          if (attribute) {
            const deletedAttribute = await attribute.deleteOne();

            resolve(deletedAttribute);
          } else {
            resolve(attribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete child attribute by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute id
   * @param {string} childAttributeId the child attribute id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteChild(
    attributeId: string,
    childAttributeId: string
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const attribute: any = await Attribute.findById(attributeId);

          if (attribute) {
            const attribute: any = await Attribute.updateOne(
              { _id: attributeId },
              { $pull: { variants: { _id: childAttributeId } } }
            );

            await this.handleProductAttribute(attributeId, childAttributeId);

            resolve(attribute);
          } else {
            resolve(attribute);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many attribute
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Array<string>} attributeIds the attribute ids.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteMany(attributeIds: Array<string>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const deletedAttributes = await Attribute.deleteMany({
            _id: { $in: attributeIds },
          });

          resolve(deletedAttributes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many child attributes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} attributeId the attribute id
   * @param {Array<string>} childAttributeIds the child attribute ids
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteChildMany(
    attributeId: string,
    childAttributeIds: Array<string>
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await Attribute.updateOne(
            { _id: attributeId },
            {
              $pull: { variants: { _id: { $in: childAttributeIds } } },
            },
            {
              multi: true,
            }
          );

          const deletedAttributes = await this.handleProductAttribute(
            attributeId,
            childAttributeIds,
            true
          );

          resolve(deletedAttributes);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Handle product attribute
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} key - The attribute id.
   * @param {string} value - The child attribute id
   * @param {boolean} multi - The multi flag.
   * @returns {Promise<void>} the eventual completion or failure
   */
  private async handleProductAttribute(
    key: string,
    value: any,
    multi = false
  ): Promise<void> {
    try {
      // const products = await Product.find({ 'variants.1': { $exists: true } });
      const products = await Product.find({ isCombination: true });

      // console.log('products', products);

      if (multi) {
        for (const p of products) {
          await Product.updateOne(
            { _id: p._id },
            {
              $pull: {
                variants: { [key]: { $in: value } },
              },
            }
          );
        }
      } else {
        for (const p of products) {
          // console.log('p', p._id);
          await Product.updateOne(
            { _id: p._id },
            {
              $pull: {
                variants: { [key]: value },
              },
            }
          );
        }
      }
    } catch (err: any) {
      console.log("err, when delete product variants", err.message);
    }
  }
}

const attributeService = new AttributeService();
export default attributeService;
