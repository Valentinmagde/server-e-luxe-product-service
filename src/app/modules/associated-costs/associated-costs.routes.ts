import express from "express";
import associatedCostController from "./associated-costs.controller";
import routesGrouping from "../../utils/routes-grouping.util";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-05
 *
 * Class AssociatedCostRoutes
 */
class AssociatedCostRoutes {
  private router: express.Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Get the associated cost routes.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @returns {express.Router} The associated cost routes
   *
   * @swagger
   * tags:
   *   name: Associated Costs
   *   description: Management of product-related costs
   */
  public associatedCostRoutes(): express.Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/costs",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/costs:
             *   post:
             *     summary: Create a new cost
             *     tags: [Associated Costs]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: path
             *         name: lang
             *         schema:
             *           type: string
             *           example: en
             *         required: true
             *         description: Language for the response. Supported
             *           languages ['en', 'fr']
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               title:
             *                 type: object
             *                 required: true
             *                 properties:
             *                   en:
             *                     type: string
             *                   fr:
             *                     type: string
             *               amount:
             *                 type: number
             *               percentage:
             *                 type: number
             *               currency:
             *                 type: string
             *                 enum: ["EUR", "USD", "GBP"]
             *               amount_type:
             *                 type: string
             *                 enum: ["fixed", "percentage"]
             *               description:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                   fr:
             *                     type: string
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *     responses:
             *       201:
             *         description: Coût créé avec succès
             *         content:
             *           application/json:
             *             schema:
             *               $ref: '#/components/schemas/AssociatedCost'
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
             */
            router.post("/", (req, res) =>
              associatedCostController.create(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/costs:
             *   get:
             *     summary: List all costs
             *     tags: [Associated Costs]
             *     parameters:
             *       - in: path
             *         name: lang
             *         schema:
             *           type: string
             *           example: en
             *         required: true
             *         description: Language for the response. Supported
             *           languages ['en', 'fr']
             *     responses:
             *       200:
             *         description: List of costs
             *         content:
             *           application/json:
             *             schema:
             *               type: array
             *               items:
             *                 $ref: '#/components/schemas/AssociatedCost'
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
             */
            router.get("/", (req, res) =>
              associatedCostController.getAll(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/costs/{costIds}/many:
             *   delete:
             *     summary: Delete many costs by IDs
             *     tags: [Associated Costs]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: path
             *         name: lang
             *         schema:
             *           type: string
             *           example: en
             *         required: true
             *         description: Language for the response. Supported
             *           languages ['en', 'fr']
             *       - in: path
             *         name: ids
             *         required: true
             *         schema:
             *           type: string
             *         example: 5f8d04b3ab35de3a342adf23,5f8d04b3ab35de3a342adf24
             *
             *     responses:
             *       204:
             *         description: Costs deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: string
             *                    example: null
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
             */
            router.delete("/:costIds/many", (req, res) =>
              associatedCostController.deleteMany(req, res)
            );
          })
        );

        router.use(
          "/cost",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/cost/{costId}:
             *   get:
             *     summary: Get a cost by ID
             *     tags: [Associated Costs]
             *     parameters:
             *       - in: path
             *         name: lang
             *         schema:
             *           type: string
             *           example: en
             *         required: true
             *         description: Language for the response. Supported
             *           languages ['en', 'fr']
             *       - in: path
             *         name: costId
             *         required: true
             *         schema:
             *           type: string
             *         example: 5f8d04b3ab35de3a342adf23
             *
             *     responses:
             *       200:
             *         description: Cost details
             *         content:
             *           application/json:
             *             schema:
             *               $ref: '#/components/schemas/AssociatedCost'
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
             */
            router.get("/:costId", (req, res) =>
              associatedCostController.getById(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/cost/{costId}:
             *   put:
             *     summary: Update a cost by ID
             *     tags: [Associated Costs]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: path
             *         name: lang
             *         schema:
             *           type: string
             *           example: en
             *         required: true
             *         description: Language for the response. Supported
             *           languages ['en', 'fr']
             *       - in: path
             *         name: costId
             *         required: true
             *         schema:
             *           type: string
             *         example: 5f8d04b3ab35de3a342adf23
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               title:
             *                 type: object
             *                 required: true
             *                 properties:
             *                   en:
             *                     type: string
             *                   fr:
             *                     type: string
             *               amount:
             *                 type: number
             *               percentage:
             *                 type: number
             *               currency:
             *                 type: string
             *                 enum: ["EUR", "USD", "GBP"]
             *               amount_type:
             *                 type: string
             *                 enum: ["fixed", "percentage"]
             *               description:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                   fr:
             *                     type: string
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *
             *     responses:
             *       200:
             *         description: Coût mis à jour
             *         content:
             *           application/json:
             *             schema:
             *               $ref: '#/components/schemas/AssociatedCost'
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
             */
            router.put("/:costId", (req, res) =>
              associatedCostController.update(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/cost/{costId}/status:
             *   patch:
             *     summary: Update the status of a cost by ID
             *     tags: [Associated Costs]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: path
             *         name: lang
             *         schema:
             *           type: string
             *           example: en
             *         required: true
             *         description: Language for the response. Supported
             *           languages ['en', 'fr']
             *       - in: path
             *         name: costId
             *         required: true
             *         schema:
             *           type: string
             *         example: 5f8d04b3ab35de3a342adf23
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: boolean
             *
             *     responses:
             *       200:
             *         description: Cost status updated successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/AssociatedCost'
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
             */
            router.patch("/:costId/status", (req, res) =>
              associatedCostController.updateStatus(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/cost/{costId}:
             *   delete:
             *     summary: Delete a cost by ID
             *     tags: [Associated Costs]
             *     security:
             *       - bearerAuth: []
             *     parameters:
             *       - in: path
             *         name: lang
             *         schema:
             *           type: string
             *           example: en
             *         required: true
             *         description: Language for the response. Supported
             *           languages ['en', 'fr']
             *       - in: path
             *         name: costId
             *         required: true
             *         schema:
             *           type: string
             *         example: 5f8d04b3ab35de3a342adf23
             *
             *     responses:
             *       204:
             *         description: Cost deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/AssociatedCost'
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
             */
            router.delete("/:costId", (req, res) =>
              associatedCostController.delete(req, res)
            );
          })
        );
      })
    );
  }
}

const associatedCostRoutes = new AssociatedCostRoutes();
export default associatedCostRoutes;
