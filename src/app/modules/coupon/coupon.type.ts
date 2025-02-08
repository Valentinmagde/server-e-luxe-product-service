export default interface CouponType {
    _id: string;
    title: object;
    logo: string;
    couponCode: string;
    startTime: Date;
    endTime: Date;
    discountType: object;
    minimumAmount: number;
    productType: string;
    status: "show" | "hide";
    created_at?: Date;
    updated_at?: Date;
    __v?: number;
}
