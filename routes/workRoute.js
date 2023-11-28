import express from "express";
import HEADERS from "./headersConst.js";

const workRouter = express.Router();

workRouter.get("/", (req, res) => {
  res.set(HEADERS);
  res.status(200).json("Server is working");
});

export default workRouter;