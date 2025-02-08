import Extra from "./extra.model";
import ExtraType from "./extra.type";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2024-11-17
 *
 * Class ExtraService
 */
class ExtraService {
  /**
   * Get all extra
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public index(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // const { type, option, option1 } = query;
          const extras = await Extra.find()
            .populate("related_product")
            .populate("group_items");

          resolve(extras);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all showing extras test
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingExtrasTest(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const extras = await Extra.find({ status: "show" });

          resolve(extras);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create an extra
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {ExtraType} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(data: ExtraType): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const extra: any = new Extra(data);
          const createdExtra = await extra.save();

          resolve(createdExtra);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create many extra
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {Array<ExtraType>} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMany(data: Array<ExtraType>): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const createdExtras: any = await Extra.insertMany(data);

          resolve(createdExtras);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get extra details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {string} extraId the extra's id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public show(extraId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const extra = await Extra.findById(extraId)
            .populate("related_product")
            .populate("group_items");

          resolve(extra);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get showing extras details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingExtras(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const extras = await Extra.find({ status: "show" });

          resolve(extras);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update an extra
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {string} extraId the extra id
   * @param {any} data the extra data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(extraId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const extra = await Extra.findById(extraId);

          if (extra) {
            extra.title = { ...extra.title, ...data.title };
            extra.name = { ...extra.name, ...data.name };
            extra.description = { ...extra.description, ...data.description };
            // extra.status = data.status;
            extra.type = data.type;
            extra.price = data.price || extra.price;
            extra.related_product = data.related_product;
            extra.group_items = data.group_items;

            // Handle options array (e.g., Dropdown, Colorpicker)
            if (Array.isArray(data.options)) {
              extra.options = this.mergeOptions(extra.options, data.options);
            }

            const updatedExtra = await extra.save();
            resolve(updatedExtra);
          } else {
            resolve(extra);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update extra status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {string} extraId the extra id
   * @param {any} data the extra data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateStatus(extraId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const extra = await Extra.findById(extraId);

          if (extra) {
            extra.status = data.status;

            const updatedExtra = await extra.save();

            resolve(updatedExtra);
          } else {
            resolve(extra);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update many extra
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {any} data the categories data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateMany(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const updatedExtras = await Extra.updateMany(
            { _id: { $in: data.ids } },
            {
              $set: {
                price: data.price,
                type: data.type,
                status: data.status,
              },
            },
            {
              multi: true,
            }
          );

          resolve(updatedExtras);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete an extra by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {string} extraId the extra id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(extraId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const extra: any = await Extra.findById(extraId);

          if (extra) {
            const deletedExtra = await extra.deleteOne();

            resolve(deletedExtra);
          } else {
            resolve(extra);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many extra
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @param {Array<string>} extraIds the extra ids.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteMany(extraIds: Array<string>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const deletedExtras = await Extra.deleteMany({
            _id: { $in: extraIds },
          });

          resolve(deletedExtras);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Merges the options array from data into the existing options.
   * @param {Array} existingOptions - Existing options to be updated.
   * @param {Array} newOptions - New options to merge into the existing ones.
   * @returns {Array} - Merged options array.
   */
  private mergeOptions(existingOptions: any[], newOptions: any[]): any[] {
    if (!existingOptions && newOptions?.length > 0) {
      return newOptions;
    }

    return newOptions.map((newOption, index) => {
      const existingOption = existingOptions?.[index] || {}; // Handle when existingOptions is shorter than newOptions

      return {
        ...existingOption, // Retain existing option data
        name: { ...existingOption.name, ...newOption.name }, // Merge 'name' translations
        value: Array.isArray(newOption.value)
          ? newOption.value.map((v: any, i: number) => ({ ...v, ...existingOption.value?.[i] })) // Merge array values
          : { ...existingOption.value, ...newOption.value }, // Merge value directly for non-array values
        type: newOption.type || existingOption.type, // Retain existing type if no new type
      };
    });
  }
}

const extraService = new ExtraService();
export default extraService;
