import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import tagController from "./tag.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-01
 *
 * Class TagRoutes
 */
class TagRoutes {
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
   * Creating all tag routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @returns {Router} the tag routes
   */
  public tagRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/tags",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/tags:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: allTags
             *     summary: Get all tags.
             *     description: Get all tags.
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
             *         description: Successfully retrieved tags.
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
             *                      $ref: '#/components/schemas/Tag'
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
            router.get("/", tagController.getTags);

            /**
             * @swagger
             * /v1/{lang}/tags:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: store
             *     summary: Add new tag.
             *     description: Add new tag.
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
             *                 description: The tag's name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The tag slug.
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
             *               status:
             *                 type: string
             *                 description: The tag's status.
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
             *                 description: The tag's name.
             *                 required: true
             *               slug:
             *                 type: string
             *                 description: |
             *                    The tag slug.
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
             *               status:
             *                 type: string
             *                 description: The tag's status.
             *                 enum: ["show", "hide"]
             *             required:
             *               - name
             *               - slug
             *
             *     responses:
             *       201:
             *         description: Tag successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Tag'
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
            router.post("/", tagController.store);

            /**
             * @swagger
             * /v1/{lang}/tags/many:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: storeMany
             *     summary: Create many tags.
             *     description: Create many tags.
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
             *                   description: The tag's name.
             *                 slug:
             *                   type: string
             *                   description: |
             *                    The tag slug.
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
             *                 status:
             *                   type: string
             *                   description: The tag's status.
             *                   enum: ["show", "hide"]
             *
             *     responses:
             *       201:
             *         description: Tags created successfully.
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
             *                      $ref: '#/components/schemas/Tag'
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
            router.post("/many", tagController.storeMany);

            /**
             * @swagger
             * /v1/{lang}/tags/showing:
             *   get:
             *     tags:
             *     - Tag
             *     operationId: getShowing
             *     summary: Get all showing tags.
             *     description: Get all showing tags.
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
             *         description: Tags successfully obtained.
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
             *                      $ref: '#/components/schemas/Tag'
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
            router.get("/showing", tagController.getShowingTag);

            /**
             * @swagger
             * /v1/{lang}/tags/many:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: updateMany
             *     summary: Update many tags.
             *     description: Update many tags.
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
             *                   description: The language's ID.
             *                 name:
             *                   type: string
             *                   description: The tag's name.
             *                 slug:
             *                   type: string
             *                   description: |
             *                    The tag slug.
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
             *                 status:
             *                   type: string
             *                   description: The tag's status.
             *                   enum: ["show", "hide"]
             *
             *     responses:
             *       200:
             *         description: Tags updated successfully.
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
             *                      $ref: '#/components/schemas/Tag'
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
            router.put("/many", tagController.updateMany);

            /**
             * @swagger
             * /v1/{lang}/tags/{tagIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: deleteMany
             *     summary: Delete many tags.
             *     description: Delete many tags.
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
             *        name: currencyIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The currencies IDs to be deleted. You can enter several identifiers, separated by commas
             *
             *     responses:
             *       204:
             *         description: Currencies deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Tag'
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
            router.delete("/:tagIds/many", tagController.deleteMany);
          })
        );

        router.use(
          "/tag",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/tag/{tagId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: byId
             *     summary: Get a tag by id.
             *     description: Get a tag by id from the system.
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
             *        name: tagId
             *        schema:
             *          type: string
             *        required: true
             *        description: Tag's id
             *
             *     responses:
             *       200:
             *         description: The tag has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Tag'
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
            router.get("/:tagId", tagController.getTagById);

            /**
             * @swagger
             * /v1/{lang}/tag/{tagId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: updateById
             *     summary: Update a tag by ID.
             *     description: Update a tag by ID.
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
             *        name: tagId
             *        schema:
             *          type: string
             *        required: true
             *        description: The tag's ID to update
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
             *                 description: The tag's name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The tag slug.
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
             *               status:
             *                 type: string
             *                 description: The tag's status.
             *                 enum: ["show", "hide"]
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The tag's name.
             *               slug:
             *                 type: string
             *                 description: |
             *                    The tag slug.
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
             *               status:
             *                 type: string
             *                 description: The tag's status.
             *                 enum: ["show", "hide"]
             *
             *     responses:
             *       200:
             *         description: Tag created successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Tag'
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
            router.put("/:tagId", tagController.update);

            /**
             * @swagger
             * /v1/{lang}/tag/{tagId}/status:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: updateStatus
             *     summary: Update a tag status.
             *     description: Update a tag status.
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
             *        name: tagId
             *        schema:
             *          type: string
             *        required: true
             *        description: The tag's ID to update
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
             *                 description: The language's status.
             *                 enum: ["show", "hide"]
             *
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The language's status.
             *                 enum: ["show", "hide"]
             *
             *     responses:
             *       200:
             *         description: Tag created successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Tag'
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
            router.put("/:tagId/status", tagController.updateStatus);

            /**
             * @swagger
             * /v1/{lang}/tag/{tagId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Tag
             *     operationId: delete
             *     summary: Delete a tag by ID.
             *     description: Delete a tag by ID.
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
             *        name: tagId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the tag to delete
             *
             *     responses:
             *       204:
             *         description: The tag deleted successfully.
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
            router.delete("/:tagId", tagController.delete);
          })
        );
      })
    );
  }
}

const tagRoutes = new TagRoutes();
export default tagRoutes;
