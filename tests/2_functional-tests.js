/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", done => {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  let bookToBeUsedInOtherTests;
  const idOfBookThatDoesntExist = "60a3c751c1cb4226e9704d44";

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", done => {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              title: "I am the title"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              bookToBeUsedInOtherTests = res["body"]["_id"];
              if (err) {
                done(err);
              } else {
                done();
              }
            });
        });

        test("Test POST /api/books with no title given", done => {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              randomUnnecessaryField: "I am not necessary"
            })
            .end((err, res) => {
              assert.equal(res.body, "missing required field title");
              if (err) {
                done(err);
              } else {
                done();
              }
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", done => {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.typeOf(
              res.body,
              "array",
              "A GET request to /api/books with no params returns an array"
            );
            assert.equal(res.status, 200);
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", done => {
        chai
          .request(server)
          .get(`/api/books/${idOfBookThatDoesntExist}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(
              res.body,
              "no book exists",
              'If id does not exist in the DB you should return "no book exists"'
            );
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });

      test("Test GET /api/books/[id] with valid id in db", done => {
        chai
          .request(server)
          .get(`/api/books/${bookToBeUsedInOtherTests}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(
              res.body._id,
              bookToBeUsedInOtherTests,
              "A book object with the object id you queried should be returned."
            );
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", done => {
          chai
            .request(server)
            .post(`/api/books/${bookToBeUsedInOtherTests}`)
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              comment: "I am the comment"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(
                res["body"]["comments"][0],
                "I am the comment",
                'The string "I am the comment" is the expected value'
              );
              if (err) {
                done(err);
              } else {
                done();
              }
            });
        });

        test("Test POST /api/books/[id] without comment field", done => {
          chai
            .request(server)
            .post(`/api/books/${bookToBeUsedInOtherTests}`)
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              randomUnnecessaryField: "This value should never be saved"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              expect(res.body).to.eql({});
              if (err) {
                done(err);
              } else {
                done();
              }
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", done => {
          chai
            .request(server)
            .post(`/api/books/${idOfBookThatDoesntExist}`)
            .set("content-type", "application/x-www-form-urlencoded")
            .send({
              comment: "random commentttttt!!!!!!"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              if (err) {
                done(err);
              } else {
                done();
              }
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function() {
      test("Test DELETE /api/books/[id] with valid id in db", done => {
        chai
          .request(server)
          .delete(`/api/books/${bookToBeUsedInOtherTests}`)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "delete successful");
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", done => {
        chai
          .request(server)
          .delete(`/api/books/${idOfBookThatDoesntExist}`)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });
  });
});