import Coupon from "./coupon.model";
import CouponType from "./coupon.type";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2024-07-20
 *
 * Class CouponService
 */
class CouponService {
  /**
   * Get all coupon
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public index(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupons = await Coupon.find()
            .sort({ _id: -1 })

          resolve(coupons);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a coupon
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {CouponType} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(data: CouponType): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupon: any = new Coupon(data);
          const createdCoupon = await coupon.save();

          resolve(createdCoupon);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create many coupons
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Array<CouponType>} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMany(data: Array<CouponType>): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // await Coupon.deleteMany();

          const createdCoupons: any = await Coupon.insertMany(data);

          resolve(createdCoupons);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get coupon details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} couponId the coupon's id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public show(couponId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupon = await Coupon.findById(couponId);

          resolve(coupon);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get coupon details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} couponCode the coupon's code
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public showByCode(couponCode: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupon = await Coupon.findOne({coupon_code: couponCode, status: "show"});

          resolve(coupon);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get showing coupons details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingCoupons(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupons: any = await Coupon.find({ status: "show" }).sort({
            _id: -1,
          });

          resolve(coupons);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a coupon
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} couponId the coupon id
   * @param {any} data the coupon data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(couponId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupon = await Coupon.findById(couponId);

          if (coupon) {
            coupon.title = { ...coupon.title, ...data.title };
            // coupon.title[req.body.lang] = req.body.title;
            // coupon.title = req.body.title;
            coupon.coupon_code = data.coupon_code;
            coupon.start_time = dayjs().utc().format(data.start_time);
            coupon.end_time = dayjs().utc().format(data.end_time);
            // coupon.discountPercentage = req.body.discountPercentage;
            coupon.minimum_amount = data.minimum_amount;
            coupon.product_type = data.product_type;
            coupon.discount_type = data.discount_type;
            coupon.logo = data.logo;

            const updatedCoupon = await coupon.save();

            resolve(updatedCoupon);
          } else {
            resolve(coupon);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update coupon status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} couponId the coupon id
   * @param {any} data the coupon data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateStatus(couponId: string, data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupon = await Coupon.findById(couponId);

          if (coupon) {
            coupon.status = data.status;

            const updatedCoupon = await coupon.save();

            resolve(updatedCoupon);
          } else {
            resolve(coupon);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update many coupons
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {any} data the coupons data
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

          const updatedCoupons = await Coupon.updateMany(
            { _id: { $in: data.ids } },
            {
              $set: updatedData,
            },
            {
              multi: true,
            }
          );

          resolve(updatedCoupons);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a coupon by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {string} couponId the coupon id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(couponId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const coupon: any = await Coupon.findById(couponId);

          if (coupon) {
            const deletedCoupon = await coupon.deleteOne();

            resolve(deletedCoupon);
          } else {
            resolve(coupon);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete many coupons
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Array<string>} couponIds the coupon ids.
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public deleteMany(couponIds: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await Coupon.deleteMany({ parentId: couponIds });
          const deletedCoupons = await Coupon.deleteMany({
            _id: couponIds,
          });

          resolve(deletedCoupons);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const couponService = new CouponService();
export default couponService;
