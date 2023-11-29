import { createRequire } from "module";
const require = createRequire(import.meta.url);
import Datastore from "nedb";

export default class dbController {
  constructor() {
    this.paintings = new Datastore({
      filename: "./db/paintings.db",
      autoload: true,
    });
    this.buyRequests = new Datastore({
      filename: "./db/buyRequests.db",
      autoload: true,
    });
    this.orderRequests = new Datastore({
      filename: "./db/orderRequests.db",
      autoload: true,
    });
    this.tokens = new Datastore({ filename: "./db/tokens.db", autoload: true });
  }

  /**
   * Метод для добавления заявки на заказ картины
   * @param {newRequest} newRequest json или object с заявкой на заказ картины для добавления в базу данных
   */
  async addOrderReq(newRequest) {
    await new Promise((resolve, reject) => {
      this.orderRequests.insert(newRequest, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  /**
   * Метод для добавления заявки на покупку картины
   * @param {*} newRequest json или object с заявкой на покупку картины для добавления в базу данных
   */
  async addBuyReq(newRequest) {
    await new Promise((resolve, reject) => {
      this.buyRequests.insert(newRequest, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  /**
   * Метод для добавления картины
   * @param {*} newPainting json или object с картиной для добавления в базу данных
   */
  async addPainting(newPainting) {
    await new Promise((resolve, reject) => {
      this.paintings.insert(painting, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  /**
   * Метод для получения всех картин
   * @returns список картин
   */
  async getAllPaintings() {
    const paintings = await new Promise((resolve, reject) => {
      this.paintings.find({}, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });

    return paintings;
  }

  /**
   * Метод для получения всех необработанных заявок на покупку картины
   * @returns список необработанных заявок на покупку картины
   */
  async getAllUnprocBuyReq() {
    const docs = await new Promise((resolve, reject) => {
      this.buyRequests.find({ request_status: "unprocessed" }, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });

    return docs;
  }

  /**
   * Метод для получения всех необработанных заявок на заказ картины
   * @returns список необработанных заявок на заказ картины
   */
  async getAllUnprocOrderReq() {
    const docs = await new Promise((resolve, reject) => {
      this.orderRequests.find(
        { request_status: "unprocessed" },
        (err, docs) => {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        }
      );
    });

    return docs;
  }

  /**
   * Метод для получения всех необработанных заявок
   * @returns список необработанных заявок
   */
  async getAllUnprocReq() {
    const unprocBuyReq = await this.getAllUnprocBuyReq();
    const unprocOrderReq = await this.getAllUnprocOrderReq();

    const allUnprocReq = [...unprocBuyReq, ...unprocOrderReq];

    return allUnprocReq;
  }

  /**
   * Метод для проверки токена на наличие в базе данных
   * @param {*} token токен для проверки
   * @returns boolean, результат проверки токена
   */
  async checkToken(token) {
    const check = await new Promise((resolve, reject) => {
      this.tokens.findOne({ token: token }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          if (doc) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });

    return check;
  }

  /**
   * Метод для проверки наличия в базе данных документа
   * @param {*} Id идентификатор документа
   * @param {*} dbToSearch база данных для поиска документа
   * @returns boolean, результат проверки Id
   */
  async checkId(Id, dbToSearch) {
    let db = null;
    switch (dbToSearch) {
      case "painting":
        db = this.paintings;
        break;
      case "orderReq":
        db = this.orderRequests;
        break;
      case "buyReq":
        db = this.buyRequests;
        break;
      default:
        break;
    }

    const check = await new Promise((resolve, reject) => {
      db.findOne({ _id: Id }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          if (doc) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });

    return check;
  }

  /**
   * Метод для обработки заявки
   * @param {*} req object с заявкой для обработки
   * @returns boolean, результат обработки заявки
   */
  async processRequest(req) {
    const requestId = req._id;
    const paintingsIdArr = req.paintingsIdArr;
    let check = true;

    if (paintingsIdArr) {
      check = await this.checkId(requestId, "buyReq");

      if (check) {
        for (let i = 0; i < paintingsIdArr.length; i++) {
          check = await this.checkId(paintingsIdArr[i], "painting");

          if (!check) {
            break;
          }
        }
      }

      if (check) {
        await this.processBuyReq(requestId, paintingsIdArr);
      }
    } else {
      check = await this.checkId(requestId, "orderReq");

      if (check) {
        await this.changeOrderReqStatus(requestId);
      }
    }

    return check;
  }

  /**
   * Метод для смены статуса заявки на заказ картины
   * @param {*} requestId Id заявки на заказ картины для смены статуса
   */
  async changeOrderReqStatus(requestId) {
    const request = await new Promise((resolve, reject) => {
      this.orderRequests.findOne({ _id: requestId }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });

    let newStatus =
      request.request_status == "processed" ? "unprocessed" : "processed";

    await this.orderRequests.update(
      { _id: requestId },
      { $set: { request_status: newStatus } },
      {},
      (err, doc) => {
        if (err) {
          throw new Error(err);
        } else {
          this.orderRequests.loadDatabase();
        }
      }
    );
  }

  /**
   * Метод для обработки заявки на покупку картины
   * @param {*} requestId Id заявки на покупку картины для смены статуса
   * @param {*} paintingsIdArr список Id картин для смены статуса
   */
  async processBuyReq(requestId, paintingsIdArr) {
    await this.changeBuyReqStatus(requestId);

    for (const paintingId of paintingsIdArr) {
      await this.changePaintingStatus(paintingId);
    }
  }

  /**
   * Метод для смены статуса заявки на покупку картины
   * @param {*} requestId Id заявки на покупку картины для смены статуса
   */
  async changeBuyReqStatus(requestId) {
    const request = await new Promise((resolve, reject) => {
      this.buyRequests.findOne({ _id: requestId }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });

    const newStatus =
      request.request_status == "processed" ? "unprocessed" : "processed";

    await this.buyRequests.update(
      { _id: requestId },
      { $set: { request_status: newStatus } },
      {},
      (err, doc) => {
        if (err) {
          throw new Error(err);
        } else {
          this.buyRequests.loadDatabase();
        }
      }
    );
  }

  /**
   * Метод для смены статуса картины
   * @param {*} paintingtId Id картины для смены статуса
   */
  async changePaintingStatus(paintingtId) {
    const painting = await new Promise((resolve, reject) => {
      this.paintings.findOne({ _id: paintingtId }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });

    const newStatus =
      painting.painting_status == "available" ? "unavailable" : "available";

    await this.paintings.update(
      { _id: paintingtId },
      { $set: { painting_status: newStatus } },
      {},
      (err, doc) => {
        if (err) {
          throw new Error(err);
        } else {
          this.paintings.loadDatabase();
        }
      }
    );
  }
}
