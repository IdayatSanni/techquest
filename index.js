// Import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const htmlRouter = require("./modules/youtube/html/router");
const javascriptRouter = require("./modules/youtube/javascript/router");
dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", htmlRouter);
app.use("/javascript", javascriptRouter);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
