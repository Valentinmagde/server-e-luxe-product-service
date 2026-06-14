import express, { Router } from "express";
import routesGrouping from "../../utils/routes-grouping.util";
import luxuryDistributionController from "./luxury-distribution.controller";

class LuxuryDistributionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  public luxuryDistributionRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/luxury-distribution",
          routesGrouping.group((router) => {
            // Browse LD catalog with imported flag
            router.get(
              "/products",
              luxuryDistributionController.browse.bind(
                luxuryDistributionController
              )
            );

            // Import a product from LD to e-luxe
            router.post(
              "/products/:stockId/import",
              luxuryDistributionController.importProduct.bind(
                luxuryDistributionController
              )
            );

            // Remove an imported product
            router.delete(
              "/products/:stockId",
              luxuryDistributionController.removeProduct.bind(
                luxuryDistributionController
              )
            );

            // Sync price/stock for an imported product
            router.patch(
              "/products/:stockId/sync",
              luxuryDistributionController.syncProduct.bind(
                luxuryDistributionController
              )
            );

            // Categories from LD API
            router.get(
              "/ld-categories",
              luxuryDistributionController.getLdCategories.bind(
                luxuryDistributionController
              )
            );

            // All unique attribute values from LD API (sizes + colors)
            router.get(
              "/ld-attribute-values",
              luxuryDistributionController.getLdAttributeValues.bind(
                luxuryDistributionController
              )
            );

            // All unique tags from LD API (products_tags + gender)
            router.get(
              "/ld-tags",
              luxuryDistributionController.getLdTags.bind(
                luxuryDistributionController
              )
            );

            // LD → e-luxe category mappings
            router.get(
              "/category-mappings",
              luxuryDistributionController.getCategoryMappings.bind(
                luxuryDistributionController
              )
            );
            router.post(
              "/category-mappings",
              luxuryDistributionController.saveCategoryMappings.bind(
                luxuryDistributionController
              )
            );

            // LD → e-luxe attribute mappings
            router.get(
              "/attribute-mappings",
              luxuryDistributionController.getAttributeMappings.bind(
                luxuryDistributionController
              )
            );
            router.post(
              "/attribute-mappings",
              luxuryDistributionController.saveAttributeMappings.bind(
                luxuryDistributionController
              )
            );

            // Sync all imported LD products
            router.post(
              "/products/sync-all",
              luxuryDistributionController.syncAll.bind(
                luxuryDistributionController
              )
            );

            // Remap all imported LD products
            router.post(
              "/products/remap-all",
              luxuryDistributionController.remapAll.bind(
                luxuryDistributionController
              )
            );

            // Remap variants for an imported product using current mappings
            router.post(
              "/products/:stockId/remap",
              luxuryDistributionController.remapProduct.bind(
                luxuryDistributionController
              )
            );

            // Validate attribute/tag mappings for a LD product before import
            router.get(
              "/products/:stockId/validate",
              luxuryDistributionController.validateImport.bind(
                luxuryDistributionController
              )
            );

            // Get stored e-luxe product for an imported LD stock
            router.get(
              "/products/:stockId/imported",
              luxuryDistributionController.getImportedProduct.bind(
                luxuryDistributionController
              )
            );

            // LD → e-luxe tag mappings
            router.get(
              "/tag-mappings",
              luxuryDistributionController.getTagMappings.bind(
                luxuryDistributionController
              )
            );
            router.post(
              "/tag-mappings",
              luxuryDistributionController.saveTagMappings.bind(
                luxuryDistributionController
              )
            );

            // Toggle publish status for an imported product
            router.patch(
              "/products/:stockId/publish",
              luxuryDistributionController.togglePublish.bind(
                luxuryDistributionController
              )
            );

            // Cron status and manual trigger
            router.get(
              "/crons",
              luxuryDistributionController.getCronStatus.bind(luxuryDistributionController)
            );
            router.post(
              "/crons/:cronId/run",
              luxuryDistributionController.runCronNow.bind(luxuryDistributionController)
            );
          })
        );
      })
    );
  }
}

const luxuryDistributionRoutes = new LuxuryDistributionRoutes();
export default luxuryDistributionRoutes;
