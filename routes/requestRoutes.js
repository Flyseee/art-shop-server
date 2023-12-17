import express from "express";
import dataBase from "../index.js";
import OptionalBody from "../optional/OptionalBody.js";

const requestRouter = express.Router();

const phoneRegex =
  /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

function isArray(variable) {
  return Array.isArray(variable);
}
function isOptionalArray(arr) {
  return (
    arr.every((item) => !Array.isArray(item)) &&
    arr.length > 0 &&
    arr.every((item) => typeof item === "string" && item.trim() !== "")
  );
}

requestRouter.get("/getAllUnprocReq", async (req, res) => {
  const allUnprocReq = await dataBase.getAllUnprocReq();

  res.status(200).json(allUnprocReq);
});

requestRouter.post("/orderPainting", (req, res) => {
  const orderReqFields = ["name", "phone_number", "comment", "request_status"];
  const newOrderReq = req.body;
  const optionalBody = new OptionalBody(newOrderReq, orderReqFields);

  if (
    optionalBody.isPresent() &&
    typeof newOrderReq.name === "string" &&
    phoneRegex.test(newOrderReq.phone_number) &&
    newOrderReq.request_status === "unprocessed"
  ) {
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

  if (
    optionalBody.isPresent() &&
    isArray(newBuyReq.paintingsIdArr) &&
    isOptionalArray(newBuyReq.paintingsIdArr) &&
    typeof newBuyReq.name === "string" &&
    phoneRegex.test(newBuyReq.phone_number) &&
    newBuyReq.request_status === "unprocessed"
  ) {
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

  if (
    optionalBody.isPresent() &&
    typeof reqToUpdate._id === 'string'
  ) {
    const result = await dataBase.processRequest(reqToUpdate);

    if (result) {
      res.status(200).json("OK");
    } else {
      res.status(404).json({ msg: "Заявка или картина не найдена" });
    }
  } else {
    res.status(400).json({
      msg: "Передано пустое тело запроса или в теле запроса нет необходимого поля",
    });
  }
});

export default requestRouter;
