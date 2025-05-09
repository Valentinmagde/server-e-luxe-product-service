import ProductType from "../product/product.type"

export default interface CategoryType {
    _id: string;
    name: object;
    slug: string;
    description: object;
    parent_id: string;
    parent_name: object;
    id: string;
    icon: string;
    image: string;
    is_top_category: boolean;
    show_products_on_homepage: boolean;
    status: 'show'|'hide';
    products: Array<ProductType>;
    children?: Array<CategoryType>;
    product_count: number;
    created_at?: Date;
    updated_at?: Date;
    __v?: number;
}
