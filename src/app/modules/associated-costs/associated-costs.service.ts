import AssociatedCost from "./associated-costs.model";
import AssociatedCostType from "./associated-costs.type";
import * as jsonpatch from "fast-json-patch";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-05
 *
 * Class AssociatedCostService
 */
class AssociatedCostService {
  /**
   * Create a new cost record
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {AssociatedCostInput} data the cost data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async create(data: AssociatedCostType): Promise<unknown> {
    return await AssociatedCost.create(data);
  }

  /**
   * Update a cost record by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {string} id the cost id
   * @param {AssociatedCostType} data the cost data
   * @return {Promise<unknown>} the eventual completion or failure`
   */
  public async update(id: string, data: AssociatedCostType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const cost = await AssociatedCost.findById(id);
          if (cost) {
            cost.title = { ...cost.title, ...data.title };
            cost.amount = data.amount;
            cost.currency = data.currency;
            cost.description = { ...cost.description, ...data.description };
            cost.amount_type = data.amount_type;
            cost.percentage = data.percentage;
            cost.status = data.status;
            await cost.save();
            resolve(cost);
          } else {
            resolve(cost);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update the status of a cost record
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {string} id the cost id
   * @param {any} data the json patch data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateStatus(
    id: string,
    data: any
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const associatedCost = await AssociatedCost.findById(id);

          if (associatedCost) {
            const updateObject = jsonpatch.applyPatch(
              associatedCost.toObject(),
              data,
              false,
              true
            ).newDocument;

            await AssociatedCost.updateOne({ _id: id }, { $set: updateObject });

            resolve(updateObject);
          } else {
            resolve(associatedCost);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Soft-delete a cost record
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {string} id the cost id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async delete(id: string): Promise<unknown> {
    return await AssociatedCost.deleteOne(
      { _id: id }
    );
  }

  /**
   * Get all costs (with optional active filter)
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {boolean} activeOnly whether to filter for active costs only
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async getAll(): Promise<unknown> {
    return await AssociatedCost.find();
  }

  /**
   * Get cost by ID (throws if not found)
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {string} id the cost id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async getById(id: string): Promise<unknown> {
    const cost = await AssociatedCost.findById(id);
    if (!cost) throw new Error("Cost not found");
    return cost;
  }

  /**
   * Get costs by IDs (for pricing calculations)
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {string[]} ids the cost ids
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async getAllByIds(ids: string[]): Promise<unknown> {
    return await AssociatedCost.find({ _id: { $in: ids } });
  }

  /**
   * Delete many cost entries by IDs
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {string[]} ids the cost ids
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async deleteMany(ids: string[]): Promise<unknown> {
    return await AssociatedCost.deleteMany({ _id: { $in: ids } });
  }
}

export default new AssociatedCostService();
