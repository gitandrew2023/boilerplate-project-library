/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const bookController = require("../public/controllers/bookController");
const router = require("express").Router();
router.get("/books", bookController.getBookList);
router.post("/books", bookController.createBook);
router.delete("/books", bookController.deleteAllBooks);
router.get("/books/:id", bookController.getBookDetail);
router.post("/books/:id", bookController.commentOnBook);
router.delete("/books/:id", bookController.deleteBookById);

module.exports = router;