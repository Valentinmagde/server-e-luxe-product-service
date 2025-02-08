import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import attributeController from "./attribute.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2024-07-20
 *
 * Class AttributeRoutes
 */
class AttributeRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all attributes routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @returns {Router} the attribute routes
   */
  public attributeRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/attributes",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/attributes:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: allAttributes
             *     summary: Get all attributes.
             *     description: Get all attributes.
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
             *         description: Attributes retrieved successfully.
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
             *                      $ref: '#/components/schemas/Attribute'
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
            router.get("/", attributeController.index);

            /**
             * @swagger
             * /v1/{lang}/attributes/showing:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: allShowing
             *     summary: Get all showing attributes.
             *     description: Get all showing attributes.
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
             *         description: Attributes retrieved successfully.
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
             *                      $ref: '#/components/schemas/Attribute'
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
            router.get("/showing", attributeController.getShowingAttributes);

            /**
             * @swagger
             * /v1/{lang}/attributes:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: store
             *     summary: Add new attribute.
             *     description: Add new attribute.
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
             *               title:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's title.
             *                   fr:
             *                     type: string
             *                     description: The coupon's title.
             *               name:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's name.
             *                   fr:
             *                     type: string
             *                     description: The coupon's name.
             *               option:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["Dropdown", "Radio", "Checkbox"]
             *                 default: "Dropdown"
             *               variants:
             *                 type: array
             *                 items:
             *                   type: object
             *                   properties:
             *                     name:
             *                       type: string
             *                       description: The variant name.
             *                     status:
             *                       type: string
             *                       lowercase: true
             *                       enum: ["show", "hide"]
             *                       default: "show"
             *               type:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["attribute", "extra"]
             *                 default: "attribute"
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *     responses:
             *       201:
             *         description: Attribute successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.post("/", attributeController.store);

            /**
             * @swagger
             * /v1/{lang}/attributes/many:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: storeMany
             *     summary: Create many attributes.
             *     description: Create many attributes.
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
             *                 title:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's title.
             *                     fr:
             *                       type: string
             *                       description: The coupon's title.
             *                 name:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's name.
             *                     fr:
             *                       type: string
             *                       description: The coupon's name.
             *                 option:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["Dropdown", "Radio", "Checkbox"]
             *                   default: "Dropdown"
             *                 variants:
             *                   type: array
             *                   items:
             *                     type: object
             *                     properties:
             *                       name:
             *                         type: string
             *                         description: The variant name.
             *                       status:
             *                         type: string
             *                         lowercase: true
             *                         enum: ["show", "hide"]
             *                         default: "show"
             *                 type:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["attribute", "extra"]
             *                   default: "attribute"
             *                 status:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["show", "hide"]
             *                   default: "show"
             *
             *     responses:
             *       201:
             *         description: Attributes created successfully.
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
             *                      $ref: '#/components/schemas/Attribute'
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
            router.post("/many", attributeController.storeMany);

            /**
             * @swagger
             * /v1/{lang}/attributes/showing/test:
             *   get:
             *     tags:
             *     - Attribute
             *     operationId: getShowingTest
             *     summary: Get all showing attributes test.
             *     description: Get all showing attributes test.
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
             *         description: Attribute successfully obtained.
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
             *                      $ref: '#/components/schemas/Attribute'
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
            router.get("/showing/test", attributeController.getShowingAttributesTest);

            /**
             * @swagger
             * /v1/{lang}/attributes/many:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: updateMany
             *     summary: Update many attributes.
             *     description: Update many attributes.
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
             *                 title:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's title.
             *                     fr:
             *                       type: string
             *                       description: The coupon's title.
             *                 name:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's name.
             *                     fr:
             *                       type: string
             *                       description: The coupon's name.
             *                 option:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["Dropdown", "Radio", "Checkbox"]
             *                   default: "Dropdown"
             *                 variants:
             *                   type: array
             *                   items:
             *                     type: object
             *                     properties:
             *                       name:
             *                         type: string
             *                         description: The variant name.
             *                       status:
             *                         type: string
             *                         lowercase: true
             *                         enum: ["show", "hide"]
             *                         default: "show"
             *                 type:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["attribute", "extra"]
             *                   default: "attribute"
             *                 status:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["show", "hide"]
             *                   default: "show"
             *
             *     responses:
             *       200:
             *         description: Attributes updated successfully.
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
             *                      $ref: '#/components/schemas/Attribute'
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
            router.put("/many", attributeController.updateMany);

            /**
             * @swagger
             * /v1/{lang}/attributes/{attributeIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: deleteMany
             *     summary: Delete many attributes.
             *     description: Delete many attributes.
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
             *        name: attributeIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The attribute IDs to be deleted. You can enter several identifiers,
             *          separated by commas
             *
             *     responses:
             *       204:
             *         description: Attributes deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.delete("/:attributeIds/many", attributeController.deleteMany);
          })
        );

        router.use(
          "/attribute",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: byId
             *     summary: Get a attribute by id.
             *     description: Get a attribute by id from the system.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: Attribute's id
             *
             *     responses:
             *       200:
             *         description: The attribute has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.get("/:attributeId", attributeController.show);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}/child/{childId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: byId
             *     summary: Get a attribute by id.
             *     description: Get a attribute by id from the system.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: Attribute's id
             *      - in: path
             *        name: childId
             *        schema:
             *          type: string
             *        required: true
             *        description: Child's id
             *
             *     responses:
             *       200:
             *         description: Attribute variant successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.get("/:attributeId/child/:childId", attributeController.showChild);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: update
             *     summary: Update a attribute by ID.
             *     description: Update a attribute by ID.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the attribute to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               title:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's title.
             *                   fr:
             *                     type: string
             *                     description: The coupon's title.
             *               name:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's name.
             *                   fr:
             *                     type: string
             *                     description: The coupon's name.
             *               option:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["Dropdown", "Radio", "Checkbox"]
             *                 default: "Dropdown"
             *               variants:
             *                 type: array
             *                 items:
             *                   type: object
             *                   properties:
             *                     name:
             *                       type: string
             *                       description: The variant name.
             *                     status:
             *                       type: string
             *                       lowercase: true
             *                       enum: ["show", "hide"]
             *                       default: "show"
             *               type:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["attribute", "extra"]
             *                 default: "attribute"
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *
             *     responses:
             *       200:
             *         description: The attribute has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.put("/:attributeId", attributeController.update);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}/children:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: storeChildren
             *     summary: Adding new children to an attribute.
             *     description: Adding new children to an attribute.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the attribute to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               variants:
             *                 type: array
             *                 items:
             *                   type: object
             *                   properties:
             *                     name:
             *                       type: string
             *                       description: The variant name.
             *                     status:
             *                       type: string
             *                       lowercase: true
             *                       enum: ["show", "hide"]
             *                       default: "show"
             *     responses:
             *       200:
             *         description: Attribute successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.put("/:attributeId/child", attributeController.storeChild);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}/child/{childId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: updateChild
             *     summary: Update attribute variant.
             *     description: UUpdate attribute variant.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the attribute to get
             *      - in: path
             *        name: childId
             *        schema:
             *          type: string
             *        required: true
             *        description: Child's id
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               variants:
             *                 type: array
             *                 items:
             *                   type: object
             *                   properties:
             *                     name:
             *                       type: string
             *                       description: The variant name.
             *                     status:
             *                       type: string
             *                       lowercase: true
             *                       enum: ["show", "hide"]
             *                       default: "show"
             *
             *     responses:
             *       200:
             *         description: The child attribute has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.put("/:attributeId/child/:childId", attributeController.updateChild);

            /**
             * @swagger
             * /v1/{lang}/attributes/children/many:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: updateChildMany
             *     summary: Update multiple children of attribute.
             *     description: Update multiple children of attribute.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: Attribute's id
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               ids:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: Child attribute ID
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *
             *     responses:
             *       200:
             *         description: Attributes updated successfully.
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
             *                      $ref: '#/components/schemas/Attribute'
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
            router.put("/:attributeId/children", attributeController.updateChildMany);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}/status:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: updateStatus
             *     summary: Update a attribute by ID.
             *     description: Update a attribute by ID.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product attribute to get
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
             *                 description: The attribute's status.
             *                 enum: ["show", "hide"]
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The attribute's status.
             *                 enum: ["show", "hide"]
             *     responses:
             *       200:
             *         description: The attribute has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.put("/:attributeId/status", attributeController.updateStatus);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}/children/status:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: updateChildStatus
             *     summary: Update child status of an attribute.
             *     description: Update child status of an attribute.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product attribute to get
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
             *                 description: The attribute's status.
             *                 enum: ["show", "hide"]
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The attribute's status.
             *                 enum: ["show", "hide"]
             *     responses:
             *       200:
             *         description: The children status attribute has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.put("/:attributeId/children/status", attributeController.updateChildStatus);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: delete
             *     summary: Delete a attribute by ID.
             *     description: Delete a attribute by ID.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the attribute to delete
             *
             *     responses:
             *       204:
             *         description: The attribute deleted successfully.
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
            router.delete("/:attributeId", attributeController.delete);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}/child/{childId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: deleteChild
             *     summary: Delete a attribute by ID.
             *     description: Delete a attribute by ID.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the attribute to delete
             *      - in: path
             *        name: childId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the child attribute to delete
             *
             *     responses:
             *       204:
             *         description: The child attribute deleted successfully.
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
            router.delete("/:attributeId/child/:childId", attributeController.deleteChild);

            /**
             * @swagger
             * /v1/{lang}/attribute/{attributeId}/children/{childIds}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: deleteChildMany
             *     summary: Delete many attributes.
             *     description: Delete many attributes.
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
             *        name: attributeId
             *        schema:
             *          type: string
             *        required: true
             *        description: The attribute ID to be deleted. You can enter several identifiers,
             *         separated by commas
             *      - in: path
             *        name: childIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The attribute IDs to be deleted. You can enter several identifiers,
             *         separated by commas
             *
             *     responses:
             *       204:
             *         description: Attributes deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Attribute'
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
            router.delete("/:attributeId/children/:childIds", attributeController.deleteChildMany);
          })
        );
      })
    );
  }
}

const attributeRoutes = new AttributeRoutes();
export default attributeRoutes;
