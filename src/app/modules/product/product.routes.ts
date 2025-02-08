import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import productController from "./product.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-06-21
 *
 * Class ProductRoutes
 */
class ProductRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-21
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all product routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-21
   *
   * @returns {Router} the product routes
   */
  public productRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/products",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/products:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: filter
             *     summary: Filter products.
             *     description: Filter products by criteria.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: query
             *        name: page
             *        schema:
             *          type: number
             *          example: 1
             *        description: Pagination position, this
             *          position is set to 1 by default
             *      - in: query
             *        name: perPage
             *        schema:
             *          type: number
             *          example: 12
             *        description: The number of items per page, this
             *          number is set to 12 by default
             *      - in: query
             *        name: vendor
             *        schema:
             *          type: string
             *        description: The product's vendor
             *      - in: query
             *        name: name
             *        schema:
             *          type: string
             *        description: The product's name
             *      - in: query
             *        name: category
             *        schema:
             *          type: string
             *        description: The product's category name
             *      - in: query
             *        name: tag
             *        schema:
             *          type: string
             *        description: The product's tag name
             *      - in: query
             *        name: min
             *        schema:
             *          type: number
             *        description: Lowest product price
             *      - in: query
             *        name: max
             *        schema:
             *          type: number
             *        description: Highest product price
             *      - in: query
             *        name: rating
             *        schema:
             *          type: number
             *        description: Product rating
             *      - in: query
             *        name: order
             *        schema:
             *          type: string
             *          example: newest
             *        description: This value can be newest,
             *          lowest, highest, toprated
             *      - in: query
             *        name: featured
             *        schema:
             *          type: string
             *          example: 0
             *        description: Featured product
             *      - in: query
             *        name: promotional
             *        schema:
             *          type: string
             *          example: 0
             *        description: Promotional product
             *
             *     responses:
             *       200:
             *         description: Successfully retrieved products.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: object
             *                    properties:
             *                      products:
             *                        type: array
             *                        items:
             *                          $ref: '#/components/schemas/Product'
             *                      previousPage:
             *                        type: number
             *                        example: null
             *                      perPage:
             *                        type: number
             *                        example: 12
             *                      allProducts:
             *                        type: number
             *                        example: 12
             *                      currentPage:
             *                        type: number
             *                        example: 1
             *                      pages:
             *                        type: number
             *                        example: 1
             *                      nextPage:
             *                        type: number
             *                        example: 2
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/", productController.showProductsByFilter);

            /**
             * @swagger
             * /v1/{lang}/products/showing:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: showing
             *     summary: Get all products shown.
             *     description: Get all products shown.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     responses:
             *       200:
             *         description: Products successfully retrieved.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: object
             *                    properties:
             *                      products:
             *                        type: array
             *                        items:
             *                          $ref: '#/components/schemas/Product'
             *                      previousPage:
             *                        type: number
             *                        example: null
             *                      perPage:
             *                        type: number
             *                        example: 12
             *                      allProducts:
             *                        type: number
             *                        example: 12
             *                      currentPage:
             *                        type: number
             *                        example: 1
             *                      pages:
             *                        type: number
             *                        example: 1
             *                      nextPage:
             *                        type: number
             *                        example: 2
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/showing", productController.getShowingProducts);

            /**
             * @swagger
             * /v1/{lang}/products/brands:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: brands
             *     summary: Get all products brands.
             *     description: Get all products brands.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     responses:
             *       200:
             *         description: Brands successfully retrieved.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: object
             *                    properties:
             *                      products:
             *                        type: array
             *                        items:
             *                          $ref: '#/components/schemas/Product'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/brands", productController.getAllBrands);

            /**
             * @swagger
             * /v1/{lang}/products/showing/store:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: filter
             *     summary: Filter products.
             *     description: Filter products by criteria.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: query
             *        name: category
             *        schema:
             *          type: string
             *        description: The product category
             *      - in: query
             *        name: title
             *        schema:
             *          type: string
             *        description: The product title
             *      - in: query
             *        name: slug
             *        schema:
             *          type: string
             *        description: The product's slug
             *
             *     responses:
             *       200:
             *         description: Products successfully retrieved.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: object
             *                    properties:
             *                      products:
             *                        type: array
             *                        items:
             *                          $ref: '#/components/schemas/Product'
             *                      previousPage:
             *                        type: number
             *                        example: null
             *                      perPage:
             *                        type: number
             *                        example: 12
             *                      allProducts:
             *                        type: number
             *                        example: 12
             *                      currentPage:
             *                        type: number
             *                        example: 1
             *                      pages:
             *                        type: number
             *                        example: 1
             *                      nextPage:
             *                        type: number
             *                        example: 2
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/showing/store",
              productController.getShowingStoreProducts
            );

            /**
             * @swagger
             * /v1/{lang}/products:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: store
             *     summary: Add new product.
             *     description: Add new product.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               sku:
             *                 type: string
             *                 description: The product's sku.
             *                 example: SKU0000245
             *               name:
             *                 type: string
             *                 description: The product's name.
             *                 example: Backpack
             *               vendor:
             *                 description: The vendor id
             *                 type: string
             *               image:
             *                 description: Product's image url
             *                 type: string
             *               brand:
             *                 description: Product's brand
             *                 type: string
             *               short_description:
             *                 description: Product's short description
             *                 type: string
             *               description:
             *                 description: Product's description
             *                 type: string
             *               price:
             *                 description: Product's price
             *                 type: number
             *                 example: 0.00
             *               promotional_price:
             *                 description: Product's promotional price
             *                 type: number
             *                 example: 0.00
             *               initialIn_stock:
             *                 description: Product's initial stock
             *                 type: number
             *                 example: 10
             *               current_stock:
             *                 description: Product's current stock
             *                 type: number
             *                 example: 10
             *               featured:
             *                 description: Featured product ? indicate 1
             *                  if and 0 otherwise
             *                 type: number
             *                 example: 0
             *               promotional:
             *                 description: Promotional product ? indicate 1
             *                  if and 0 otherwise
             *                 type: number
             *                 example: 0
             *               rating:
             *                 description: Product's rating.
             *                  Value between 1 and 5
             *                 type: number
             *                 example: 0
             *               numReviews:
             *                 description: Number of reviews
             *                 type: number
             *                 example: 0
             *               reviews:
             *                 type: array
             *                 items:
             *                   type: object
             *                   properties:
             *                     name:
             *                       type: string
             *                       description: Name of reviewer
             *                       example: Herman
             *                     email:
             *                       type: string
             *                       description: Email of reviewer
             *                       example: reviewer@example.com
             *                     comment:
             *                       type: string
             *                       description: Comment of reviewer
             *                       example: An excellent product
             *                     rating:
             *                       type: number
             *                       description: Product's rating.
             *                          Value between 1 and 5
             *                       example: 1
             *               tags:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: Tag's id
             *               categories:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: Category's id
             *               related_products:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: Related product's id
             *               store:
             *                 type: string
             *                 description: Store's id
             *               shipping:
             *                 type: object
             *                 properties:
             *                   weight:
             *                     type: number
             *                     description: the product weight
             *                   dimension:
             *                     type: object
             *                     properties:
             *                       length:
             *                         type: number
             *                         description: the product length
             *                       width:
             *                         type: number
             *                         description: the product width
             *                       height:
             *                         type: number
             *                         description: the product height
             *                   class:
             *                     type: string
             *                     description: Shipping class
             *             required:
             *               - sku
             *               - name
             *               - price
             *
             *     responses:
             *       201:
             *         description: Product successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.post("/", productController.store);

            /**
             * @swagger
             * /v1/{lang}/products/many:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: storeMany
             *     summary: Add multiple products.
             *     description: Add multiple products.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: array
             *             items:
             *               type: object
             *               properties:
             *                 sku:
             *                   type: string
             *                   description: The product's sku.
             *                   example: SKU0000245
             *                 name:
             *                   type: string
             *                   description: The product's name.
             *                   example: Backpack
             *                 vendor:
             *                   description: The vendor id
             *                   type: string
             *                 image:
             *                   description: Product's image url
             *                   type: string
             *                 brand:
             *                   description: Product's brand
             *                   type: string
             *                 short_description:
             *                   description: Product's short description
             *                   type: string
             *                 description:
             *                   description: Product's description
             *                   type: string
             *                 price:
             *                   description: Product's price
             *                   type: number
             *                   example: 0.00
             *                 promotional_price:
             *                   description: Product's promotional price
             *                   type: number
             *                   example: 0.00
             *                 initialIn_stock:
             *                   description: Product's initial stock
             *                   type: number
             *                   example: 10
             *                 current_stock:
             *                   description: Product's current stock
             *                   type: number
             *                   example: 10
             *                 featured:
             *                   description: Featured product ? indicate 1
             *                    if and 0 otherwise
             *                   type: number
             *                   example: 0
             *                 promotional:
             *                   description: Promotional product ? indicate 1
             *                    if and 0 otherwise
             *                   type: number
             *                   example: 0
             *                 rating:
             *                   description: Product's rating.
             *                    Value between 1 and 5
             *                   type: number
             *                   example: 0
             *                 numReviews:
             *                   description: Number of reviews
             *                   type: number
             *                   example: 0
             *                 reviews:
             *                   type: array
             *                   items:
             *                     type: object
             *                     properties:
             *                       name:
             *                         type: string
             *                         description: Name of reviewer
             *                         example: Herman
             *                       email:
             *                         type: string
             *                         description: Email of reviewer
             *                         example: reviewer@example.com
             *                       comment:
             *                         type: string
             *                         description: Comment of reviewer
             *                         example: An excellent product
             *                       rating:
             *                         type: number
             *                         description: Product's rating.
             *                          Value between 1 and 5
             *                         example: 1
             *                 tags:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: Tag's id
             *                 categories:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: Category's id
             *                 related_products:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: Related product's id
             *                 store:
             *                   type: string
             *                   description: Store's id
             *                 shipping:
             *                   type: object
             *                   properties:
             *                     weight:
             *                       type: number
             *                       description: the product weight
             *                     dimension:
             *                       type: object
             *                       properties:
             *                         length:
             *                           type: number
             *                           description: the product length
             *                         width:
             *                           type: number
             *                           description: the product width
             *                         height:
             *                           type: number
             *                           description: the product height
             *                     class:
             *                       type: string
             *                       description: Shipping class
             *             required:
             *               - sku
             *               - name
             *               - price
             *
             *     responses:
             *       201:
             *         description: Products successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.post("/many", productController.storeMultiple);

            /**
             * @swagger
             * /v1/{lang}/products/many:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: updateMany
             *     summary: Update multiple products.
             *     description: Update multiple products.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: array
             *             items:
             *               type: object
             *               properties:
             *                 sku:
             *                   type: string
             *                   description: The product's sku.
             *                   example: SKU0000245
             *                 name:
             *                   type: string
             *                   description: The product's name.
             *                   example: Backpack
             *                 vendor:
             *                   description: The vendor id
             *                   type: string
             *                 image:
             *                   description: Product's image url
             *                   type: string
             *                 brand:
             *                   description: Product's brand
             *                   type: string
             *                 short_description:
             *                   description: Product's short description
             *                   type: string
             *                 description:
             *                   description: Product's description
             *                   type: string
             *                 price:
             *                   description: Product's price
             *                   type: number
             *                   example: 0.00
             *                 promotional_price:
             *                   description: Product's promotional price
             *                   type: number
             *                   example: 0.00
             *                 initialIn_stock:
             *                   description: Product's initial stock
             *                   type: number
             *                   example: 10
             *                 current_stock:
             *                   description: Product's current stock
             *                   type: number
             *                   example: 10
             *                 featured:
             *                   description: Featured product ? indicate 1 if and 0 otherwise
             *                   type: number
             *                   example: 0
             *                 promotional:
             *                   description: Promotional product ? indicate 1 if and 0 otherwise
             *                   type: number
             *                   example: 0
             *                 rating:
             *                   description: Product's rating. Value between 1 and 5
             *                   type: number
             *                   example: 0
             *                 numReviews:
             *                   description: Number of reviews
             *                   type: number
             *                   example: 0
             *                 reviews:
             *                   type: array
             *                   items:
             *                     type: object
             *                     properties:
             *                       name:
             *                         type: string
             *                         description: Name of reviewer
             *                         example: Herman
             *                       email:
             *                         type: string
             *                         description: Email of reviewer
             *                         example: reviewer@example.com
             *                       comment:
             *                         type: string
             *                         description: Comment of reviewer
             *                         example: An excellent product
             *                       rating:
             *                         type: number
             *                         description: Product's rating. Value between 1 and 5
             *                         example: 1
             *                 tags:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: Tag's id
             *                 categories:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: Category's id
             *                 related_products:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: Related product's id
             *                 store:
             *                   type: string
             *                   description: Store's id
             *                 shipping:
             *                   type: object
             *                   properties:
             *                     weight:
             *                       type: number
             *                       description: the product weight
             *                     dimension:
             *                       type: object
             *                       properties:
             *                         length:
             *                           type: number
             *                           description: the product length
             *                         width:
             *                           type: number
             *                           description: the product width
             *                         height:
             *                           type: number
             *                           description: the product height
             *                     class:
             *                       type: string
             *                       description: Shipping class
             *             required:
             *               - sku
             *               - name
             *               - price
             *
             *     responses:
             *       200:
             *         description: Products successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/many", productController.updateMany);

            /**
             * @swagger
             * /v1/{lang}/products/{productIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: deleteMany
             *     summary: Delete many products.
             *     description: Delete many products.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The product IDs to be deleted. You can enter several identifiers,
             *          separated by commas
             *
             *     responses:
             *       204:
             *         description: Products deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.delete("/:productIds/many", productController.deleteMany);
          })
        );

        router.use(
          "/product",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/product/{productId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: byId
             *     summary: Get a product by id.
             *     description: Get a product by id from the system.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: Product's id
             *
             *     responses:
             *       200:
             *         description: The product has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/:productId", productController.showProductById);

            /**
             * @swagger
             * /v1/{lang}/product/slug/{slug}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: bySlug
             *     summary: Get product by slug.
             *     description: Get a product from the system by name (slug).
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: slug
             *        schema:
             *          type: string
             *        required: true
             *        description: Product's id
             *
             *     responses:
             *       200:
             *         description: The product has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/slug/:slug", productController.getProductBySlug);

            /**
             * @swagger
             * /v1/{lang}/product/{productId}/category/{categoryId}/assign:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: assignCategory
             *     summary: Assign a category to a product.
             *     description: Assign a category to a product.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product to get
             *      - in: path
             *        name: categoryId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the category to get
             *
             *     responses:
             *       200:
             *         description: The category successfully assigned to a
             *                      product.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/:productId/category/:categoryId/assign",
              productController.assignToCategory
            );

            router.post("/:productId/reviews", productController.createReview);

            /**
             * @swagger
             * /v1/{lang}/product/{productId}/category/{categoryId}/unassign:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: unassignCategory
             *     summary: Unassign a category to a product.
             *     description: Unassign a category to a product.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product to get
             *      - in: path
             *        name: categoryId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the category to get
             *
             *     responses:
             *       200:
             *         description: The category successfully unassigned to a
             *                      product.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/:productId/category/:categoryId/unassign",
              productController.unassignFromCategory
            );

            /**
             * @swagger
             * /v1/{lang}/product/{productId}/tag/{tagId}/assign:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: assignTag
             *     summary: Assign a tag to a product.
             *     description: Assign a tag to a product.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product to get
             *      - in: path
             *        name: tagId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the tag to get
             *
             *     responses:
             *       200:
             *         description: The tag successfully assigned to a
             *                      product.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/:productId/tag/:tagId/assign",
              productController.assignToTag
            );

            /**
             * @swagger
             * /v1/{lang}/product/{productId}/tag/{tagId}/unassign:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: unassignCategory
             *     summary: Unassign a tag to a product.
             *     description: Unassign a tag to a product.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product to get
             *      - in: path
             *        name: tagId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the tag to get
             *
             *     responses:
             *       200:
             *         description: The tag successfully unassigned to a
             *                      product.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get(
              "/:productId/tag/:tagId/unassign",
              productController.unassignFromTag
            );

            /**
             * @swagger
             * /v1/{lang}/product/{productId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: update
             *     summary: Update a product.
             *     description: Update a product.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               sku:
             *                 type: string
             *                 description: The product's sku.
             *                 example: SKU0000245
             *               name:
             *                 type: string
             *                 description: The product's name.
             *                 example: Backpack
             *               vendor:
             *                 description: The vendor id
             *                 type: string
             *               image:
             *                 description: Product's image url
             *                 type: string
             *               brand:
             *                 description: Product's brand
             *                 type: string
             *               short_description:
             *                 description: Product's short description
             *                 type: string
             *               description:
             *                 description: Product's description
             *                 type: string
             *               price:
             *                 description: Product's price
             *                 type: number
             *                 example: 0.00
             *               promotional_price:
             *                 description: Product's promotional price
             *                 type: number
             *                 example: 0.00
             *               initialIn_stock:
             *                 description: Product's initial stock
             *                 type: number
             *                 example: 10
             *               current_stock:
             *                 description: Product's current stock
             *                 type: number
             *                 example: 10
             *               featured:
             *                 description: Featured product ? indicate 1
             *                  if and 0 otherwise
             *                 type: number
             *                 example: 0
             *               promotional:
             *                 description: Promotional product ? indicate 1
             *                  if and 0 otherwise
             *                 type: number
             *                 example: 0
             *               rating:
             *                 description: Product's rating.
             *                  Value between 1 and 5
             *                 type: number
             *                 example: 0
             *               numReviews:
             *                 description: Number of reviews
             *                 type: number
             *                 example: 0
             *               reviews:
             *                 type: array
             *                 items:
             *                   type: object
             *                   properties:
             *                     name:
             *                       type: string
             *                       description: Name of reviewer
             *                       example: Herman
             *                     email:
             *                       type: string
             *                       description: Email of reviewer
             *                       example: reviewer@example.com
             *                     comment:
             *                       type: string
             *                       description: Comment of reviewer
             *                       example: An excellent product
             *                     rating:
             *                       type: number
             *                       description: Product's rating.
             *                          Value between 1 and 5
             *                       example: 1
             *               tags:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: Tag's id
             *               categories:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: Category's id
             *               related_products:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: Related product's id
             *               store:
             *                 type: string
             *                 description: Store's id
             *               shipping:
             *                 type: object
             *                 properties:
             *                   weight:
             *                     type: number
             *                     description: the product weight
             *                   dimension:
             *                     type: object
             *                     properties:
             *                       length:
             *                         type: number
             *                         description: the product length
             *                       width:
             *                         type: number
             *                         description: the product width
             *                       height:
             *                         type: number
             *                         description: the product height
             *                   class:
             *                     type: string
             *                     description: Shipping class
             *             required:
             *               - sku
             *               - name
             *               - price
             *
             *     responses:
             *       202:
             *         description: Product successfully updated.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/:productId", productController.update);

            /**
             * @swagger
             * /v1/{lang}/product/{productId}:
             *   patch:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: patch
             *     summary: Patch a product by ID.
             *     description: Patch a product by ID.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product to get
             *
             *     requestBody:
             *       required: true
             *       description: We can find the documentation on the JSON
             *                    Patch format [here](https://jsonpatch.com/)
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/PatchBody'
             *
             *     responses:
             *       200:
             *         description: The product has successfully patched.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Product'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.patch("/:productId", productController.patch);

            /**
             * @swagger
             * /v1/{lang}/product/{productId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Product
             *     operationId: delete
             *     summary: Delete a product by ID.
             *     description: Delete a product by ID.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: productId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product to delete
             *
             *     responses:
             *       204:
             *         description: The product deleted successfully.
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.delete("/:productId", productController.delete);
          })
        );
      })
    );
  }
}

const productRoutes = new ProductRoutes();
export default productRoutes;
