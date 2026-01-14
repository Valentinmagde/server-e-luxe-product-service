import express, { Router, Request, Response} from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import customizationController from "./customization.controller";

dotenv.config();

/**
 * Customization Routes
 */
class CustomizationRoutes {
    private router: Router;

    /**
     * Create a new Routes instance.
     */
    constructor() {
        this.router = express.Router({ mergeParams: true });
    }

    /**
       * Creating all customization routes
       *
       * @author Valentin Magde <valentinmagde@gmail.com>
       * @since 2026-01-09
       *
       * @returns {Router} the customization routes
       */
      public customizationRoutes(): Router {
        return this.router.use(
          routesGrouping.group((router) => {
            router.use(
              "/customizations",
              routesGrouping.group((router) => {
                /**
                 * @swagger
                 * /v1/{lang}/customizations:
                 *   get:
                 *     security:
                 *      - bearerAuth: []
                 *     tags:
                 *     - Customization
                 *     operationId: filter
                 *     summary: Filter customizations.
                 *     description: Filter customizations by criteria.
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
                 *        name: name
                 *        schema:
                 *          type: string
                 *        description: The product's name
                 *
                 *     responses:
                 *       200:
                 *         description: Customizations successfully retrieved.
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
                 *                      customizations:
                 *                        type: array
                 *                        items:
                 *                          $ref: '#/components/schemas/Customization'
                 *                      previousPage:
                 *                        type: number
                 *                        example: null
                 *                      perPage:
                 *                        type: number
                 *                        example: 12
                 *                      allCustomizations:
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
                router.get("/", (req: Request, res: Response) => customizationController.getCustomizations(req, res));

                /**
                 * @swagger
                 * /v1/{lang}/customizations:
                 *   post:
                 *     security:
                 *      - bearerAuth: []
                 *     tags:
                 *     - Customization
                 *     operationId: store
                 *     summary: Add new customization.
                 *     description: Add new customization.
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
                 *               name:
                 *                 type: string
                 *                 description: The customer's name.
                 *               email:
                 *                 description: The customer's email.
                 *                 type: string
                 *               notes:
                 *                 description: The customer's notes.
                 *                 type: string
                 *             required:
                 *               - email
                 *               - name
                 *               - notes
                 *
                 *     responses:
                 *       201:
                 *         description: Customization successfully created.
                 *         content:
                 *           application/json:
                 *             schema:
                 *                type: object
                 *                properties:
                 *                  status:
                 *                    type: string
                 *                    example: Ok
                 *                  data:
                 *                    $ref: '#/components/schemas/Customization'
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
                router.post("/", customizationController.store);
              })
            );

            router.use(
              "/customization",
              routesGrouping.group((router) => {
                /**
                 * @swagger
                 * /v1/{lang}/customization/{customizationId}:
                 *   get:
                 *     security:
                 *      - bearerAuth: []
                 *     tags:
                 *     - Customization
                 *     operationId: byId
                 *     summary: Get a customization by id.
                 *     description: Get a customization by id from the system.
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
                 *        name: customizationId
                 *        schema:
                 *          type: string
                 *        required: true
                 *        description: Customization's id
                 *
                 *     responses:
                 *       200:
                 *         description: Customization successfully retrieved.
                 *         content:
                 *           application/json:
                 *             schema:
                 *                type: object
                 *                properties:
                 *                  status:
                 *                    type: string
                 *                    example: Ok
                 *                  data:
                 *                    $ref: '#/components/schemas/Customization'
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
                router.get("/:customizationId", customizationController.show);

                /**
                 * @swagger
                 * /v1/{lang}/customization/{customizationId}:
                 *   put:
                 *     security:
                 *      - bearerAuth: []
                 *     tags:
                 *     - Customization
                 *     operationId: update
                 *     summary: Update a customization.
                 *     description: Update a customization.
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
                 *        name: customizationId
                 *        schema:
                 *          type: string
                 *        required: true
                 *        description: String ID of the customization to get
                 *
                 *     requestBody:
                 *       required: true
                 *       content:
                 *         application/json:
                 *           schema:
                 *             type: object
                 *             properties:
                 *               name:
                 *                 type: string
                 *                 description: The customer's name.
                 *               email:
                 *                 description: The customer's email.
                 *                 type: string
                 *               notes:
                 *                 description: The customer's notes.
                 *                 type: string
                 *             required:
                 *               - email
                 *               - name
                 *               - notes
                 *
                 *     responses:
                 *       202:
                 *         description: Customization successfully updated.
                 *         content:
                 *           application/json:
                 *             schema:
                 *                type: object
                 *                properties:
                 *                  status:
                 *                    type: string
                 *                    example: Ok
                 *                  data:
                 *                    $ref: '#/components/schemas/Customization'
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
                router.put("/:customizationId", customizationController.update);

                /**
                 * @swagger
                 * /v1/{lang}/customization/{customizationId}:
                 *   patch:
                 *     security:
                 *      - bearerAuth: []
                 *     tags:
                 *     - Customization
                 *     operationId: update
                 *     summary: Update a customization.
                 *     description: Update a customization.
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
                 *        name: customizationId
                 *        schema:
                 *          type: string
                 *        required: true
                 *        description: String ID of the customization to get
                 *
                 *     requestBody:
                 *       required: true
                 *       content:
                 *         application/json:
                 *           schema:
                 *             type: object
                 *             properties:
                 *               name:
                 *                 type: string
                 *                 description: The customer's name.
                 *               email:
                 *                 description: The customer's email.
                 *                 type: string
                 *               notes:
                 *                 description: The customer's notes.
                 *                 type: string
                 *             required:
                 *               - email
                 *               - name
                 *               - notes
                 *
                 *     responses:
                 *       202:
                 *         description: Customization successfully updated.
                 *         content:
                 *           application/json:
                 *             schema:
                 *                type: object
                 *                properties:
                 *                  status:
                 *                    type: string
                 *                    example: Ok
                 *                  data:
                 *                    $ref: '#/components/schemas/Customization'
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
                router.patch("/:customizationId", customizationController.patch);

                /**
                 * @swagger
                 * /v1/{lang}/customization/{customizationId}:
                 *   delete:
                 *     security:
                 *      - bearerAuth: []
                 *     tags:
                 *     - Customization
                 *     operationId: delete
                 *     summary: Delete a customization by ID.
                 *     description: Delete a customization by ID.
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
                 *        name: customizationId
                 *        schema:
                 *          type: string
                 *        required: true
                 *        description: String ID of the customization to delete
                 *
                 *     responses:
                 *       204:
                 *         description: The customization was deleted successfully.
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
                router.delete("/:customizationId", customizationController.delete);
              })
            );
          })
        );
      }
}

const customizationRoutes = new CustomizationRoutes();
export default customizationRoutes;
