import express from "express";
import dataBase from "../index.js";

const autorisationRoutes = express.Router();

autorisationRoutes.post("/", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    res.status(400).json({ msg: "Отсутствует тело запроса" });
    return;
  }
  const checkResult = await dataBase.checkToken(token);

  if (checkResult) {
    res.status(200).json("wuegruyewfbhbfhg56236");
  } else {
    res.status(401).json("Invalid token");
  }
});

export default autorisationRoutes;
