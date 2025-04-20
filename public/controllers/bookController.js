const Book = require("../models/models").Book;

const bookController = {
  createBook: (req, res) => {
    const title = req.body.title;
    if (!title) {
      return res.json("missing required field title");
    }
    const bookToBeCreated = new Book({
      title
    });

    bookToBeCreated.save((err, data) => {
      if (err) {
        return console.error(err);
      } else {
        const { _id, title } = data;
        const result = { _id, title };
        res.json(result);
      }
    });
  },
  getBookList: (req, res) => {
    Book.find((err, books) => {
      if (err) {
        return console.error(err);
      }
      return res.json(books);
    });
  },
  deleteAllBooks: (req, res) => {
    Book.deleteMany({})
      .then(() => {
        res.json("complete delete successful");
      })
      .catch(err => {
        console.log(err);
      });
  },
  commentOnBook: async (req, res) => {
    const comment = req.body.comment;
    const _id = req.params.id;
    if (!comment) {
      return res.send("missing required field comment");
    }
    Book.findById(_id, (err, book) => {
      if (!err) {
        if (!book) {
          return res.send("no book exists");
        }
        book.comments.push(comment);
        book.commentcount += 1;
        book.save((err, data) => {
          if (err) {
            return res.send(err);
          } else {
            return res.json(book);
          }
        });
      } else {
        console.log(err);
      }
    });
  },
  getBookDetail: (req, res) => {
    const _id = req.params.id;
    Book.findById(_id, (err, book) => {
      if (!book) {
        return res.json("no book exists");
      } else if (!err) {
        return res.json(book);
      }
    });
  },
  deleteBookById: async (req, res) => {
    const _id = req.params.id;
    Book.findById(_id, (err, book) => {
      if (!book) {
        return res.json("no book exists");
      }
      Book.deleteOne({ _id }, (err, data) => {
        if (err) {
          return res.json("an error occured");
        }
        return res.json("delete successful");
      });
    });
  }
};

module.exports = bookController;