import express from "express";
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();
const autorisationRoutes = express.Router();

autorisationRoutes.post("/", async (req, res) => {  
  const { token } = req.body;
  const secretToken = process.env.TOKEN;
  
  if (!token || typeof token != 'string') {
    res.status(400).json({ msg: "Отсутствует тело запроса или передано некорректно" });
    return;
  }
  if (token === secretToken) {
    res.status(200).json("../../wuegruyewfbhbfhg56236.html");
  } else {
    res.status(401).json("Invalid token");
  }
});

export default autorisationRoutes;