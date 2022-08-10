const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./users/users.route");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use("/users", router);

// start server
const port = process.env.NODE_ENV === "production" ? 80 : 4000;
app.listen(port, function () {
  console.log("Server listening on port " + port);
});
