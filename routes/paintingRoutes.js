import express from "express";
import dataBase from "../index.js";
import OptionalBody from "../optional/OptionalBody.js";
import HEADERS from "./headersConst.js";

const paintingRouter = express.Router();

paintingRouter.post("/addPainting", async (req, res) => {
  const paintingFields = [
    "painting_name",
    "details",
    "img",
    "type",
    "cost",
    "painting_status",
  ];

  const newPainting = req.body;
  const optionalBody = new OptionalBody(newPainting, paintingFields);

  res.set(HEADERS);

  if (optionalBody.isPresent()) {
    await dataBase.addPainting(newPainting);
    res.status(201).json("OK");
  } else {
    res.status(400).json({
      msg: "Передано пустое тело запроса или в теле запроса нет необходимого поля",
    });
  }
});

paintingRouter.get("/getAllPaintings", async (req, res) => {
  const paintings = await dataBase.getAllPaintings();

  res.set(HEADERS);
  res.status(200).json(paintings);
});

export default paintingRouter;
