import exchangeRateModel from "./exchange-rate.model";
import * as jsonpatch from "fast-json-patch";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-06
 *
 * Class ExchangeRateService
 */
class ExchangeRateService {
  /**
   * Get all exchange rates
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
          const rates = await exchangeRateModel.find();

          resolve(rates);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get exchange rate by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} rateId the exchange rate id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getById(rateId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rate = await exchangeRateModel.findById(rateId);

          resolve(rate);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a new exchange rate
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {any} data the exchange rate data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async create(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rate = new exchangeRateModel(data);

          const createdRate = await rate.save();

          resolve(createdRate);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Convert amount between currencies
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {number} amount the amount
   * @param {string} from the from currency
   * @param {string} to the to currency
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async convert(
    amount: number,
    from: string,
    to: string
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rate = await exchangeRateModel.findOne({
            from_currency: from,
            to_currency: to,
          });

          if (rate) {
            resolve({
              amount: amount,
              from: from,
              to: to,
              rate: rate.rate,
              converted_amount: amount * rate.rate,
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
   * Update an exchange rate by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} rateId the exchange rate id
   * @param {any} data the exchange rate data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public update(rateId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rate = await exchangeRateModel.findById(rateId);

          if (rate) {
            rate.from_currency = data.from_currency || rate.from_currency;
            rate.to_currency = data.to_currency || rate.to_currency;
            rate.rate = data.rate || rate.rate;
            rate.fee_percentage = data.fee_percentage || rate.fee_percentage;

            const updatedRate = await rate.save();

            resolve(updatedRate);
          } else {
            resolve(rate);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update an exchange rate status by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} rateId the exchange rate id
   * @param {any} data the exchange rate data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public updateStatus(rateId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rate = await exchangeRateModel.findById(rateId);

          if (rate) {
            const updateObject = jsonpatch.applyPatch(
              rate.toObject(),
              data,
              false,
              true
            ).newDocument;

            await exchangeRateModel.findByIdAndUpdate(
              { _id: rateId },
              { $set: updateObject }
            );

            resolve(updateObject);
          } else {
            resolve(rate);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete an exchange rate by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string} rateId the exchange rate id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(rateId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const rate = await exchangeRateModel.findById(rateId);

          if (rate) {
            const deletedRate = await rate.deleteOne();

            resolve(deletedRate);
          } else {
            resolve(rate);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many exchange rates by IDs
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {string[]} rateIds the exchange rate ids
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteMany(rateIds: string[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const deletedRates = await exchangeRateModel.deleteMany({
            _id: { $in: rateIds },
          });

          resolve(deletedRates);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const exchangeRateService = new ExchangeRateService();
export default exchangeRateService;
