// BUILD YOUR SERVER HERE
const http = require("http");
const { find, findById, insert, update, remove } = require("./users/model");
const { URL } = require("url");

const server = new http.createServer((req, res) => {
  const url = new URL(`http://localhost:9000${req.url}`);
  const { method } = req;

  if (method === "POST" && url.pathname === "/api/users") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      const { name, bio } = JSON.parse(data);
      if (!name || !bio) {
        res.statusCode = 400;
        res.statusMessage = "Please provide name and bio for the user";
        res.end(
          JSON.stringify({
            message: "Please provide name and bio for the user",
          })
        );
      } else {
        insert({ name, bio })
          .then((user) => {
            res.statusCode = 201;
            res.end(JSON.stringify(user));
          })
          .catch(() => {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                message:
                  "There was an error while saving the user to the database",
              })
            );
          });
      }
    });
  }

  if (method === "GET" && url.pathname === "/api/users") {
    find()
      .then((users) => {
        res.statusCode = 200;
        res.end(JSON.stringify(users));
      })
      .catch(() => {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "The users information could not be retrieved",
          })
        );
      });
  }

  if (
    method === "GET" &&
    url.pathname.slice(0, 10) === "/api/users" &&
    url.pathname.length > 10
  ) {
    let userId = url.pathname.slice(11);

    findById(userId)
      .then((user) => {
        if (user) {
          res.statusCode = 200;
          res.end(JSON.stringify(user));
        } else {
          res.statusCode = 404;
          res.end(
            JSON.stringify({
              message: "The user with the specified ID does not exist",
            })
          );
        }
      })
      .catch(() => {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "The user information could not be retrieved",
          })
        );
      });
  }

  if (
    method === "PUT" &&
    url.pathname.slice(0, 10) === "/api/users" &&
    url.pathname.length > 10
  ) {
    let userId = url.pathname.slice(11);

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
        const { name, bio } = JSON.parse(data);
        if (!name || !bio) {
          res.statusCode = 400;
          res.statusMessage = "Please provide name and bio for the user";
          res.end(
            JSON.stringify({
              message: "Please provide name and bio for the user",
            })
          );
        } else {

      update(userId, {name, bio})
        .then((user) => {
          if (user) {
            res.statusCode = 200;
            res.end(JSON.stringify(user));
          } else {
            res.statusCode = 404;
            res.end(
              JSON.stringify({
                message: "The user with the specified ID does not exist",
              })
            );
          }
        })
        .catch(() => {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              message: "The user information could not be modified",
            })
          );
        });
    }});
  }

  if (
    method === "DELETE" &&
    url.pathname.slice(0, 10) === "/api/users" &&
    url.pathname.length > 10
  ) {
    let userId = url.pathname.slice(11);

    remove(userId)
      .then((user) => {
        if (user) {
          res.statusCode = 200;
          res.end(JSON.stringify(user));
        } else {
          res.statusCode = 404;
          res.end(
            JSON.stringify({
              message: "The user with the specified ID does not exist",
            })
          );
        }
      })
      .catch(() => {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "The user could not be removed",
          })
        );
      });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
