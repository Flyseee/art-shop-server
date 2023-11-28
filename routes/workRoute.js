import express from "express";

const workRouter = express.Router();

workRouter.get("/", (req, res) => {
  res.status(200).json("Server is working");
});

export default workRouter;