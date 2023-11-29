# ArtShop server

## Описание

Серверная часть для сайта магазина картин. Сервер базируется по адресу <https://brullov-shop.onrender.com>. <br>

## Базы данных

В проекте реализовано три базы данных с использованием nedb: <br>

### paintings

```json
[
  {
    "painting_name": "У Богородицкого дуба",
    "details": "61×74 см",
    "img": "http://....",
    "type": "genre",
    "cost": 7000,
    "painting_status": "available",
    "_id": "2XOUzrV8hDBPb6cg"
  },
  {
    "painting_name": "Граф К.А. Поццо ди Борго",
    "details": "71×63 см",
    "img": "https://....",
    "type": "portrait",
    "cost": 5000,
    "painting_status": "available",
    "_id": "6kfXBvmJhEKBZ0JJ"
  },
  {
    "painting_name": "Портрет молодой женщины у фортепьяно",
    "details": "102×83 см",
    "img": "https://....",
    "type": "portrait",
    "cost": 6000,
    "painting_status": "available",
    "_id": "AJyPHbnewpFeQqNA"
  }
]
```

### orderRequests

```json
[
  {
    "name": "Полина",
    "phone_number": "+79152384696",
    "comment": "Нарисуйте моего песика, пожалуйста",
    "request_status": "unprocessed",
    "_id": "BIMr0JIAgg5cVGjB"
  },
  {
    "name": "Константин",
    "phone_number": "+79115881232",
    "comment": "Хотел бы, чтобы Вы написали портрет моей дочери",
    "request_status": "unprocessed",
    "_id": "EG2hG7J8OtaS1RtI"
  }
]
```

### buyRequests

```json
[
  {
    "name": "Алина",
    "phone_number": "+79216279682",
    "paintingsIdArr": ["2XOUzrV8hDBPb6cg"],
    "request_status": "unprocessed",
    "_id": "92oUjhQorYP2U2mu"
  },
  {
    "name": "Виктор",
    "phone_number": "+79219345675",
    "paintingsIdArr": ["6kfXBvmJhEKBZ0JJ", "AJyPHbnewpFeQqNA"],
    "request_status": "unprocessed",
    "_id": "U0HIVbsHkwGpRNTs"
  }
]
```

---

## Методы

- `GET` `../`
  <br>&emsp; Для проверки работы сервиса.
- `POST` `../autorisation`
  <br>&emsp; Для проверки правильности токена.
  Как тело запроса метод ожидает объект следующего вида: <br>

```json
{
  "token": "c484idFo1mWBqEGZZx6X"
}
```

- `GET` `../paintings/getAllPaintings`
  <br>&emsp; Для получения списка картин.
- `POST` `../paintings/addPainting`
  <br>&emsp; Для добавления новой картины.
  Как тело запроса метод ожидает объект следующего вида: <br>

```json
{
  "painting_name": "У Богородицкого дуба",
  "details": "61×74 см",
  "img": "http://....",
  "type": "genre",
  "cost": 7000,
  "painting_status": "available"
}
```

- `GET` `../requests/getAllUnprocReq`
  <br>&emsp; Для получения списка необработанных заявок (заявок со статусом "unprocessed").<br>
- `POST` `../requests/buyPainting`
  <br>&emsp; Для добавления заявки на покупку картины.
  Как тело запроса метод ожидает объект следующего вида: <br>

```json
{
  "name": "Алина",
  "phone_number": "+79216279682",
  "paintingsIdArr": ["2XOUzrV8hDBPb6cg"],
  "request_status": "unprocessed"
}
```

- `POST` `../requests/orderPainting`
  <br>&emsp; Для добавления заявки на заказ картины.
  Как тело запроса метод ожидает объект следующего вида: <br>

```json
{
  "name": "Полина",
  "phone_number": "+79152384696",
  "comment": "Нарисуйте моего песика, пожалуйста",
  "request_status": "unprocessed"
}
```

- `POST` `../requests/processRequest`
  <br>&emsp; Для обработки заявок.
  Как тело запроса метод ожидает объект следующего вида: <br>

```json
{
  "_id": "92oUjhQorYP2U2mu",
  "paintingsIdArr": ["2XOUzrV8hDBPb6cg"]
}
```

или

```json
{
  "_id": "BIMr0JIAgg5cVGjB"
}
```

---
