import express from "express";
import dataBase from "../index.js";
import OptionalBody from "../optional/OptionalBody.js";
import HEADERS from "./headersConst.js";

const requestRouter = express.Router();

requestRouter.get("/getAllUnprocReq", async (req, res) => {
  const allUnprocReq = await dataBase.getAllUnprocReq();

  res.set(HEADERS);
  res.status(200).json(allUnprocReq);
});

requestRouter.post("/orderPainting", (req, res) => {
  const orderReqFields = ["name", "phone_number", "comment", "request_status"];
  const newOrderReq = req.body;
  const optionalBody = new OptionalBody(newOrderReq, orderReqFields);

  res.set(HEADERS);

  if (optionalBody.isPresent()) {
    dataBase.addOrderReq(newOrderReq);
    res.status(200).json("OK");
  } else {
    res.status(400).json({
      msg: "Передано пустое тело запроса или в теле запроса нет необходимого поля",
    });
  }
});

requestRouter.post("/buyPainting", (req, res) => {
  const buyReqFields = [
    "name",
    "phone_number",
    "paintingsIdArr",
    "request_status",
  ];
  const newBuyReq = req.body;
  const optionalBody = new OptionalBody(newBuyReq, buyReqFields);

  res.set(HEADERS);

  if (optionalBody.isPresent()) {
    dataBase.addBuyReq(newBuyReq);
    res.status(200).json("OK");
  } else {
    res.status(400).json({
      msg: "Передано пустое тело запроса или в теле запроса нет необходимого поля",
    });
  }
});

requestRouter.post("/processRequest", async (req, res) => {
  const reqFields = ["_id"];
  const reqToUpdate = req.body;
  const optionalBody = new OptionalBody(reqToUpdate, reqFields);

  if (optionalBody.isPresent()) {
    const result = await dataBase.processRequest(reqToUpdate);
    
    res.set(HEADERS);

    if (result) {
      res.status(200).json("OK");
    } else {
      res.status(404).json({msg: 'Заявка или картина не найдена'})
    }
  } else {
    res.status(400).json({
      msg: "Передано пустое тело запроса или в теле запроса нет необходимого поля",
    });
  }
});

export default requestRouter;
