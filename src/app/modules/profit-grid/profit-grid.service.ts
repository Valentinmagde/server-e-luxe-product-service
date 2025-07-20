import ProfitGrid from "./profit-grid.model";
import ProfitGridType from "./profit-grid.type";
import * as jsonpatch from "fast-json-patch";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-06
 *
 * Class ProfitGridService
 */
class ProfitGridService {
  /**
   * Get all profit grid
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getAll(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grids = await ProfitGrid.find().sort({ _id: -1 });

          resolve(grids);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all showing profit grid
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingProfitGrid(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grids = await ProfitGrid.find({ status: "show" }).sort({
            _id: -1,
          });

          resolve(grids);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get profit grid by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} gridId the grid id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getById(gridId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grid = await ProfitGrid.findById(gridId);

          resolve(grid);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a new profit grid
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {ProfitGridType} data the grid data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public create(data: ProfitGridType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grid = new ProfitGrid(data);

          const createdGrid = await grid.save();

          resolve(createdGrid);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Calculate profit based on amount
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {number} amount the amount
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public calculateProfit(amount: number): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grid = await ProfitGrid.findOne({
            minAmount: { $lte: amount },
            maxAmount: { $gte: amount },
          });

          if (grid) {
            resolve({
              gross_profit: amount * (grid.gross_rate / 100),
              net_profit: amount * (grid.net_rate / 100),
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a profit grid by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} gridId the grid id
   * @param {ProfitGridType} data the grid data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public update(gridId: string, data: ProfitGridType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grid = await ProfitGrid.findById(gridId);

          if (grid) {
            grid.min_amount = data.min_amount || grid.min_amount;
            grid.max_amount = data.max_amount || grid.max_amount;
            grid.gross_rate = data.gross_rate || grid.gross_rate;
            grid.deduction_rate = data.deduction_rate || grid.deduction_rate;
            grid.status = data.status || grid.status;

            const updatedGrid = await grid.save();

            resolve(updatedGrid);
          } else {
            resolve(grid);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update the status of a profit grid
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} gridId the grid id
   * @param {any} data the json patch data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateStatus(gridId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grid = await ProfitGrid.findById(gridId);

          if (grid) {
            const updateObject = jsonpatch.applyPatch(
              grid.toObject(),
              data,
              false,
              true
            ).newDocument;

            await ProfitGrid.findByIdAndUpdate({ _id: gridId }, { $set: updateObject });

            resolve(updateObject);
          } else {
            resolve(grid);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a profit grid by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} gridId the grid id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(gridId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const grid = await ProfitGrid.findById(gridId);

          if (grid) {
            const deletedGrid = await grid.deleteOne();

            resolve(deletedGrid);
          } else {
            resolve(grid);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many profit grid by IDs
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string[]} gridIds the grid ids
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteMany(gridIds: string[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const deletedGrids = await ProfitGrid.deleteMany({
            _id: { $in: gridIds },
          });

          resolve(deletedGrids);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const profitGridService = new ProfitGridService();
export default profitGridService;
