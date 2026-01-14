import Customization from "./customization.model";
import * as jsonpatch from "fast-json-patch";

/**
 * Service for managing customization options.
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2026-01-09
 * @module CustomizationService
 */
class CustomizationService {
  /**
   * Get all customization.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {any} query The query parameters.
   * @returns {Promise<any>} A promise that resolves to the customization options.
   */
  async getCustomizations(query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const {
            day,
            status,
            page = 1,
            limit = 10,
            method,
            endDate,
            startDate,
            customerName,
          } = query;

          // Build query object
          const queryObject: Record<string, any> = this.buildQueryObject({
            day,
            status,
            method,
            endDate,
            startDate,
            customerName,
          });

          // Calculate pagination
          const skip = (page - 1) * limit;

          // Execute queries in parallel
          const [total, customizations] = await Promise.all([
            Customization.countDocuments(queryObject),
            this.fetchCustomizations(queryObject, skip, limit),
          ]);

          resolve({
            customizations,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get a customization by ID.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {string} id The ID of the customization to retrieve.
   * @returns {Promise<any>} A promise that resolves to the customization.
   */
  async show(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const customization = await Customization.findById(id).populate({
            path: "product_id",
            select: "_id sku name title prices",
          }).then((customization) => {
            return {
              ...customization?.toObject(),
              customer_name: customization?.name,
              customer_email: customization?.email,
              product: customization?.product_id,
              product_id: undefined,
            };
          });

          resolve(customization);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Add a new customization.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {any} customization The customization to add.
   * @returns {Promise<any>} A promise that resolves when the customization is added.
   */
  async store(customization: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const newCustomization = new Customization(customization);
          await newCustomization.save();
          resolve(newCustomization);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a customization.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {string} id The ID of the customization to update.
   * @param {any} customization The updated customization data.
   * @returns {Promise<any>} A promise that resolves when the customization is updated.
   */
  async update(id: string, customization: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const updatedCustomization = await Customization.findByIdAndUpdate(
            id,
            customization,
            { new: true }
          );
          resolve(updatedCustomization);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Patch a customization.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-14
   *
   * @param {string} customizationId the customization id
   * @param {any} data the update object
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async patch(customizationId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const customization = await Customization.findById(customizationId);

          if (customization) {
            const updateObject = jsonpatch.applyPatch(
              customization.toObject(),
              data,
              false,
              true
            ).newDocument;

            await Customization.updateOne(
              { _id: customizationId },
              { $set: updateObject }
            );

            resolve(updateObject);
          } else {
            resolve(customization);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a customization.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {string} id The ID of the customization to delete.
   * @returns {Promise<any>} A promise that resolves when the customization is deleted.
   */
  async delete(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const deletedCustomization = await Customization.findByIdAndRemove(
            id
          );
          resolve(deletedCustomization);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Build query object
   *
   * @param {any} params the query object
   * @private
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-30
   *
   * @returns {Record<string, any>} the query object
   */
  private buildQueryObject(params: {
    day?: number;
    status?: string;
    method?: string;
    endDate?: string;
    startDate?: string;
    customerName?: string;
  }): Record<string, any> {
    const { day, status, method, endDate, startDate, customerName } = params;
    const queryObject: Record<string, any> = {};

    // Status filtering
    if (status) {
      queryObject.status = { $regex: new RegExp(status, "i") };
    } else {
      queryObject.status = {
        $in: [
          "pending",
          "processing",
          "completed",
          "cancelled",
          "rejected",
          "approved",
        ],
      };
    }

    // Date filtering
    // if (day) {
    //   const date = new Date();
    //   date.setDate(date.getDate() - day);
    //   queryObject.created_at = { $gte: date, $lte: new Date() };
    // }

    if (startDate && endDate) {
      queryObject.created_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Customer name search
    if (customerName) {
      queryObject.name = new RegExp(customerName.trim(), "i");
    }

    return queryObject;
  }

  /** Fetch withdrawals
   *
   * @param {Record<string, any>} queryObject the query object
   * @param {number} skip the skip number
   * @param {number} limit the limit number
   * @param {string} [customerName] the customer name
   * @private
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-30
   *
   * @returns {Promise<any[]>} the withdrawals
   */
  private async fetchCustomizations(
    queryObject: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<any[]> {
    console.log("queryObject", queryObject);
    return Customization.find(queryObject)
      .populate({
        path: "product_id",
        select: "_id name title prices",
      })
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .then((customizations) => {
        return customizations.map((customization) => {
          return {
            ...customization,
            customer_name: customization.name,
            customer_email: customization.email,
            product: customization.product_id,
            product_id: undefined,
          };
        });
      });
  }
}

const customizationService = new CustomizationService();
export default customizationService;
