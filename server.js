"use strict";
const express = require("express");
const app = express();
const ejs = require("ejs")

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const jokeRoutes = require("./routes/jokebook.route");
const { db_close } = require("./models/db-conn");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/ejs");

app.use("/jokebook", jokeRoutes);

app.get("/", (req, res) => {
  res.redirect("/jokebook/random");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log("App listening at http://localhost:" + PORT);
});

process.on("SIGINT", cleanUp);
function cleanUp() {
  console.log("Terminate signal received.");
  db_close();
  console.log("...Closing HTTP server.");
  server.close(() => {
    console.log("...HTTP server closed.")
  })
}