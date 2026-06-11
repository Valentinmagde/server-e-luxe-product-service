import { Request, Response } from "express";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import luxuryDistributionService from "./luxury-distribution.service";

class LuxuryDistributionController {
  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Browse the Luxury Distribution catalog (with imported flag).
   * GET /luxury-distribution/products?offset=0&limit=50&search=...
   */
  public async browse(req: Request, res: Response): Promise<void> {
    try {
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const search = (req.query.search as string) || undefined;

      const result = await luxuryDistributionService.browse(
        offset,
        limit,
        search
      );
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Import a single product from LD into e-luxe.
   * POST /luxury-distribution/products/:stockId/import
   * Body: { categoryId: string }
   */
  public async importProduct(req: Request, res: Response): Promise<void> {
    try {
      const { stockId } = req.params;
      const { categoryId } = req.body;

      if (!categoryId) {
        customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.validator,
            errMsg: "categoryId is required",
          },
          res
        );
        return;
      }

      const product = await luxuryDistributionService.importProduct(
        stockId,
        categoryId
      );
      customResponse.success(
        { status: statusCode.httpCreated, data: product },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Remove an imported product from e-luxe.
   * DELETE /luxury-distribution/products/:stockId
   */
  public async removeProduct(req: Request, res: Response): Promise<void> {
    try {
      const { stockId } = req.params;
      const result = await luxuryDistributionService.removeProduct(stockId);
      customResponse.success(
        { status: statusCode.httpOk, data: result },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Sync price and stock for an imported product.
   * PATCH /luxury-distribution/products/:stockId/sync
   */
  public async syncProduct(req: Request, res: Response): Promise<void> {
    try {
      const { stockId } = req.params;
      const product = await luxuryDistributionService.syncProduct(stockId);
      customResponse.success({ status: statusCode.httpOk, data: product }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get the list of categories from the Luxury Distribution API.
   * GET /luxury-distribution/ld-categories
   */
  public async getLdCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await luxuryDistributionService.getLdCategories();
      customResponse.success({ status: statusCode.httpOk, data: categories }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getLdAttributeValues(req: Request, res: Response): Promise<void> {
    try {
      const force = req.query.force === "true";
      const result = await luxuryDistributionService.getLdAttributeValues(force);
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getLdTags(req: Request, res: Response): Promise<void> {
    try {
      const force = req.query.force === "true";
      const tags = await luxuryDistributionService.getLdTags(force);
      customResponse.success({ status: statusCode.httpOk, data: tags }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get all LD → e-luxe category mappings.
   * GET /luxury-distribution/category-mappings
   */
  public async getCategoryMappings(req: Request, res: Response): Promise<void> {
    try {
      const mappings = await luxuryDistributionService.getCategoryMappings();
      customResponse.success({ status: statusCode.httpOk, data: mappings }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Save (bulk upsert/delete) LD → e-luxe category mappings.
   * POST /luxury-distribution/category-mappings
   * Body: { mappings: [{ ld_category, eluxe_category_id }] }
   */
  public async saveCategoryMappings(req: Request, res: Response): Promise<void> {
    try {
      const { mappings } = req.body;
      if (!Array.isArray(mappings)) {
        customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.validator,
            errMsg: "mappings array is required",
          },
          res
        );
        return;
      }
      const result = await luxuryDistributionService.saveCategoryMappings(mappings);
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get all LD → e-luxe attribute mappings.
   * GET /luxury-distribution/attribute-mappings
   */
  public async getAttributeMappings(req: Request, res: Response): Promise<void> {
    try {
      const mappings = await luxuryDistributionService.getAttributeMappings();
      customResponse.success({ status: statusCode.httpOk, data: mappings }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Save (bulk upsert/delete) LD → e-luxe attribute mappings.
   * POST /luxury-distribution/attribute-mappings
   * Body: { mappings: [{ ld_value, eluxe_attribute_id, eluxe_variant_id }] }
   */
  public async saveAttributeMappings(req: Request, res: Response): Promise<void> {
    try {
      const { mappings } = req.body;
      if (!Array.isArray(mappings)) {
        customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.validator,
            errMsg: "mappings array is required",
          },
          res
        );
        return;
      }
      const result = await luxuryDistributionService.saveAttributeMappings(mappings);
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Remap variants of an imported product using current attribute mappings.
   * POST /luxury-distribution/products/:stockId/remap
   */
  public async remapProduct(req: Request, res: Response): Promise<void> {
    try {
      const { stockId } = req.params;
      const product = await luxuryDistributionService.remapProduct(stockId);
      customResponse.success({ status: statusCode.httpOk, data: product }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Validate attribute/tag mappings for a given LD product before import.
   * GET /luxury-distribution/products/:stockId/validate
   */
  public async validateImport(req: Request, res: Response): Promise<void> {
    try {
      const { stockId } = req.params;
      const result = await luxuryDistributionService.validateImport(stockId);
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get the stored e-luxe product for an imported LD stock.
   * GET /luxury-distribution/products/:stockId/imported
   */
  public async getImportedProduct(req: Request, res: Response): Promise<void> {
    try {
      const { stockId } = req.params;
      const product = await luxuryDistributionService.getImportedProduct(stockId);
      customResponse.success({ status: statusCode.httpOk, data: product }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get all LD → e-luxe tag mappings.
   * GET /luxury-distribution/tag-mappings
   */
  public async getTagMappings(req: Request, res: Response): Promise<void> {
    try {
      const mappings = await luxuryDistributionService.getTagMappings();
      customResponse.success({ status: statusCode.httpOk, data: mappings }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Save (bulk upsert/delete) LD → e-luxe tag mappings.
   * POST /luxury-distribution/tag-mappings
   * Body: { mappings: [{ ld_tag, eluxe_tag_id }] }
   */
  public async saveTagMappings(req: Request, res: Response): Promise<void> {
    try {
      const { mappings } = req.body;
      if (!Array.isArray(mappings)) {
        customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.validator,
            errMsg: "mappings array is required",
          },
          res
        );
        return;
      }
      const result = await luxuryDistributionService.saveTagMappings(mappings);
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Sync all imported LD products.
   * POST /luxury-distribution/products/sync-all
   */
  public async syncAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await luxuryDistributionService.syncAll();
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Remap all imported LD products.
   * POST /luxury-distribution/products/remap-all
   */
  public async remapAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await luxuryDistributionService.remapAll();
      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Toggle publish status for an imported product.
   * PATCH /luxury-distribution/products/:stockId/publish
   * Body: { published: boolean }
   */
  public async togglePublish(req: Request, res: Response): Promise<void> {
    try {
      const { stockId } = req.params;
      const { published } = req.body;

      if (typeof published !== "boolean") {
        customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.validator,
            errMsg: "published (boolean) is required",
          },
          res
        );
        return;
      }

      const product = await luxuryDistributionService.togglePublish(stockId, published);
      customResponse.success({ status: statusCode.httpOk, data: product }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response): void {
    customResponse.error(
      {
        status: error?.status || statusCode.httpInternalServerError,
        errNo: errorNumbers.genericError,
        errMsg: error?.message || error,
      },
      res
    );
  }
}

export default new LuxuryDistributionController();
