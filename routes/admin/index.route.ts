import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";

const adminRoutes = (app: Express): void => {
  app.use(`/admin/dashboard`, dashboardRoutes);
};

export default adminRoutes;
