require("./config/db");
require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authApi = require("./router/Auth.routes");
const placeApi = require('./router/Place.routes');
const serviceApi = require('./router/Service.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth/", authApi);
app.use("/api/place/", placeApi);
app.use("/api/service/", serviceApi);

app.use(cors())

// app.use("/api/users/", usersApi);
app.get("/", function (req, res) {
  res.send("Wedeyet App API Gateway.");
});

app.use((err, req, res) => {
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors[2]).forEach((key) =>
      valErrors.push(err.errors.message[1])
    );
    res.status(422).send(valErrors);
  }
});

const server = app.listen(process.env.PORT || 80, () =>
  console.log(`Server started at port ${process.env.PORT}`)
);
