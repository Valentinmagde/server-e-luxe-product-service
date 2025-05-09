import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import categoryController from "./category.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-07-31
 *
 * Class CategoryRoutes
 */
class CategoryRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all category routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @returns {Router} the category routes
   */
  public categoryRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/categories",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/categories:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: allCategories
             *     summary: Get all categories.
             *     description: Get all categories.
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
             *         description: Successfully retrieved categories.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
            router.get("/", categoryController.getCategories);

            /**
             * @swagger
             * /v1/{lang}/categories/featured:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: featuredCategories
             *     summary: Get all featured categories.
             *     description: Get all featured categories.
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
             *         description: Successfully retrieved featured categories.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
            router.get("/featured", categoryController.getFeaturedCategories);

            /**
             * @swagger
             * /v1/{lang}/categories/showingProductsOnHomepage:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: showingProductsOnHomepage
             *     summary: Get all showing products on homepage categories.
             *     description: Get all showing products on homepage categories.
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
             *         description: Successfully retrieved showing products on homepage categories.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
            router.get("/showingProductsOnHomePage", categoryController.getShowingProductsOnHomePageCategories);

            /**
             * @swagger
             * /v1/{lang}/categories/withProducts:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: withProducts
             *     summary: Get all categories with products.
             *     description: Get all categories with products.
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
             *         description: Successfully retrieved categories with products.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
              "/withProducts",
              categoryController.getCategoriesWithProducts
            );

            /**
             * @swagger
             * /v1/{lang}/categories/all:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: allCategories
             *     summary: Get all categories.
             *     description: Get all categories.
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
             *         description: Successfully retrieved categories.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
            router.get("/all", categoryController.getAllCategory);

            /**
             * @swagger
             * /v1/{lang}/categories:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: store
             *     summary: Add new category.
             *     description: Add new category.
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
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The category's name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The category slug.
             *
             *                    A string can be qualified as a slug if it
             *                    meets the following criteria:
             *                    - It consists of lowercase alphanumeric
             *                      characters (a-z, 0-9) and hyphens (-).
             *                    - It does not contain any spaces, special
             *                      characters, or accented characters.
             *                    - It accurately and concisely describes the
             *                      content of the resource it identifies.
             *                    - It is unique within the context of the
             *                      website or application.
             *               description:
             *                 type: string
             *                 description: The category's description.
             *               parentName:
             *                 type: string
             *                 description: The category's parent name.
             *               icon:
             *                 type: string
             *                 description: The category's imagde.
             *               status:
             *                 type: string
             *                 description: The category's status.
             *                 enum: ["show", "hide"]
             *             required:
             *               - name
             *               - slug
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The category's name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The category slug.
             *
             *                    A string can be qualified as a slug if it
             *                    meets the following criteria:
             *                    - It consists of lowercase alphanumeric
             *                      characters (a-z, 0-9) and hyphens (-).
             *                    - It does not contain any spaces, special
             *                      characters, or accented characters.
             *                    - It accurately and concisely describes the
             *                      content of the resource it identifies.
             *                    - It is unique within the context of the
             *                      website or application.
             *               description:
             *                 type: string
             *                 description: The category's description.
             *               parentName:
             *                 type: string
             *                 description: The category's parent name.
             *               icon:
             *                 type: string
             *                 description: The category's imagde.
             *               status:
             *                 type: string
             *                 description: The category's status.
             *                 enum: ["show", "hide"]
             *             required:
             *               - name
             *               - slug
             *
             *
             *     responses:
             *       201:
             *         description: Category successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Category'
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
            router.post("/", categoryController.store);

            /**
             * @swagger
             * /v1/{lang}/categories/many:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: storeMany
             *     summary: Create many categories.
             *     description: Create many categories.
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
             *                 name:
             *                   type: string
             *                   description: The category's name.
             *                 slug:
             *                   type: string
             *                   description: |
             *                    The category slug.
             *
             *                    A string can be qualified as a slug if it
             *                    meets the following criteria:
             *                    - It consists of lowercase alphanumeric
             *                      characters (a-z, 0-9) and hyphens (-).
             *                    - It does not contain any spaces, special
             *                      characters, or accented characters.
             *                    - It accurately and concisely describes the
             *                      content of the resource it identifies.
             *                    - It is unique within the context of the
             *                      website or application.
             *                 description:
             *                   type: string
             *                   description: The category's description.
             *                 parentName:
             *                   type: string
             *                   description: The category's parent name.
             *                 icon:
             *                   type: string
             *                   description: The category's imagde.
             *                 status:
             *                   type: string
             *                   description: The category's status.
             *                   enum: ["show", "hide"]
             *
             *     responses:
             *       201:
             *         description: Categories created successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
            router.post("/many", categoryController.storeMany);

            /**
             * @swagger
             * /v1/{lang}/categories/showing:
             *   get:
             *     tags:
             *     - Category
             *     operationId: getShowing
             *     summary: Get all showing categories.
             *     description: Get all showing categories.
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
             *         description: Categories successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
            router.get("/showing", categoryController.getShowingCategories);

            /**
             * @swagger
             * /v1/{lang}/categories/many:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: updateMany
             *     summary: Update many categoryes.
             *     description: Update many categoryes.
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
             *                 _id:
             *                   type: string
             *                   description: The category's ID.
             *                 name:
             *                   type: string
             *                   description: The category's name.
             *                   example: English
             *                 slug:
             *                   type: string
             *                   description: |
             *                    The category slug.
             *
             *                    A string can be qualified as a slug if it
             *                    meets the following criteria:
             *                    - It consists of lowercase alphanumeric
             *                      characters (a-z, 0-9) and hyphens (-).
             *                    - It does not contain any spaces, special
             *                      characters, or accented characters.
             *                    - It accurately and concisely describes the
             *                      content of the resource it identifies.
             *                    - It is unique within the context of the
             *                      website or application.
             *                 description:
             *                   type: string
             *                   description: The category's description.
             *                 parentName:
             *                   type: string
             *                   description: The category's parent name.
             *                 icon:
             *                   type: string
             *                   description: The category's imagde.
             *                 status:
             *                   type: string
             *                   description: The category's status.
             *                   enum: ["show", "hide"]
             *
             *     responses:
             *       200:
             *         description: Categories updated successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Category'
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
            router.put("/many", categoryController.updateMany);

            /**
             * @swagger
             * /v1/{lang}/categories/{categoryIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: deleteMany
             *     summary: Delete many categories.
             *     description: Delete many categories.
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
             *        name: categoryIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The category IDs to be deleted. You can enter several identifiers, separated by commas
             *
             *     responses:
             *       204:
             *         description: Categories deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Category'
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
            router.delete("/:categoryIds/many", categoryController.deleteMany);
          })
        );

        router.use(
          "/category",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/category/{categoryId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: byId
             *     summary: Get a category by id.
             *     description: Get a category by id from the system.
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
             *        name: categoryId
             *        schema:
             *          type: string
             *        required: true
             *        description: Category's id
             *
             *     responses:
             *       200:
             *         description: The category has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Category'
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
            router.get("/:categoryId", categoryController.getCategoryById);

            /**
             * @swagger
             * /v1/{lang}/category/slug/{slug}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: bySlug
             *     summary: Get category by slug.
             *     description: Get a category from the system by name (slug).
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
             *        description: Category's slug
             *
             *     responses:
             *       200:
             *         description: The category has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Category'
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
            router.get("/slug/:slug", categoryController.getCategoryBySlug);

            /**
             * @swagger
             * /v1/{lang}/category/{categoryId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: update
             *     summary: Update a category by ID.
             *     description: Update a category by ID.
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
             *        name: categoryId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product category to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The category name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The category slug.
             *
             *                    A string can be qualified as a slug if it
             *                    meets the following criteria:
             *                    - It consists of lowercase alphanumeric
             *                      characters (a-z, 0-9) and hyphens (-).
             *                    - It does not contain any spaces, special
             *                      characters, or accented characters.
             *                    - It accurately and concisely describes the
             *                      content of the resource it identifies.
             *                    - It is unique within the context of the
             *                      website or application.
             *               description:
             *                 type: string
             *                 description: The category's description.
             *               parentName:
             *                 type: string
             *                 description: The category's parent name.
             *               icon:
             *                 type: string
             *                 description: The category's imagde.
             *               status:
             *                 type: string
             *                 description: The category's status.
             *                 enum: ["show", "hide"]
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The category name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The category slug.
             *
             *                    A string can be qualified as a slug if it
             *                    meets the following criteria:
             *                    - It consists of lowercase alphanumeric
             *                      characters (a-z, 0-9) and hyphens (-).
             *                    - It does not contain any spaces, special
             *                      characters, or accented characters.
             *                    - It accurately and concisely describes the
             *                      content of the resource it identifies.
             *                    - It is unique within the context of the
             *                      website or application.
             *               description:
             *                 type: string
             *                 description: The category's description.
             *               parentName:
             *                 type: string
             *                 description: The category's parent name.
             *               icon:
             *                 type: string
             *                 description: The category's imagde.
             *               status:
             *                 type: string
             *                 description: The category's status.
             *                 enum: ["show", "hide"]
             *     responses:
             *       200:
             *         description: The category has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Category'
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
            router.put("/:categoryId", categoryController.update);

            /**
             * @swagger
             * /v1/{lang}/category/{categoryId}/status:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: updateStatus
             *     summary: Update a category by ID.
             *     description: Update a category by ID.
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
             *        name: categoryId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product category to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The category's status.
             *                 enum: ["show", "hide"]
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The category name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The category slug.
             *
             *                    A string can be qualified as a slug if it
             *                    meets the following criteria:
             *                    - It consists of lowercase alphanumeric
             *                      characters (a-z, 0-9) and hyphens (-).
             *                    - It does not contain any spaces, special
             *                      characters, or accented characters.
             *                    - It accurately and concisely describes the
             *                      content of the resource it identifies.
             *                    - It is unique within the context of the
             *                      website or application.
             *     responses:
             *       200:
             *         description: The category has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Category'
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
            router.put("/:categoryId/status", categoryController.updateStatus);

            /**
             * @swagger
             * /v1/{lang}/category/{categoryId}:
             *   patch:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: patch
             *     summary: Patch a category by ID.
             *     description: Patch a category by ID.
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
             *         description: The category has successfully patched.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Category'
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
            router.patch("/:categoryId", categoryController.patch);

            /**
             * @swagger
             * /v1/{lang}/category/{categoryId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Category
             *     operationId: delete
             *     summary: Delete a category by ID.
             *     description: Delete a category by ID.
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
             *        name: categoryId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the category to delete
             *
             *     responses:
             *       204:
             *         description: The category deleted successfully.
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
            router.delete("/:categoryId", categoryController.delete);
          })
        );
      })
    );
  }
}

const categoryRoutes = new CategoryRoutes();
export default categoryRoutes;
