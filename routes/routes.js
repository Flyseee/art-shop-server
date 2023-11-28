import express from "express";
import paintingRoutes from "./paintingRoutes.js";
import requestRoutes from "./requestRoutes.js";
import autorisationRoutes from "./autorisationRoutes.js";

const routes = express.Router();

routes.use("/paintings", paintingRoutes);
routes.use("/requests", requestRoutes);
routes.use("/autorisation", autorisationRoutes);

export default routes;
