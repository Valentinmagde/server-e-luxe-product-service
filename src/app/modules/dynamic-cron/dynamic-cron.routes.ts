import express, { Router } from "express";
import routesGrouping from "../../utils/routes-grouping.util";
import dynamicCronController from "./dynamic-cron.controller";

class DynamicCronRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  public dynamicCronRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/dynamic-crons",
          routesGrouping.group((router) => {
            router.get("/", dynamicCronController.list.bind(dynamicCronController));
            router.get("/:id", dynamicCronController.getById.bind(dynamicCronController));
            router.post("/", dynamicCronController.create.bind(dynamicCronController));
            router.put("/:id", dynamicCronController.update.bind(dynamicCronController));
            router.patch("/:id/toggle", dynamicCronController.toggle.bind(dynamicCronController));
            router.delete("/:id", dynamicCronController.remove.bind(dynamicCronController));
            router.post("/:id/run", dynamicCronController.runNow.bind(dynamicCronController));
          })
        );
      })
    );
  }
}

const dynamicCronRoutes = new DynamicCronRoutes();
export default dynamicCronRoutes;
