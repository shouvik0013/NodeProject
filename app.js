// CORE MOUDLES
const path = require("path");

// THIRD PARTY
const express = require("express"); // EXPRESS
const bodyParser = require("body-parser"); // BODY PARSER

// ROUTES
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// UTILS
const rootDirectoryPath = require("./utils/path");
const sequelize = require("./utils/database");
// CONTROLLERS
const errorController = require("./controllers/error");

// EXPRESS App
const app = express();

// SETTING TEMPLATING ENGINE
app.set("view engine", "ejs");
app.set("views", "views");

// PARSES INCOMMING REQUEST
app.use(bodyParser.urlencoded({ extended: false })); // bodyParser is also a middleware
// EXPOSING "public" FOLDER TO PROVIDE DIRECT ACCESS
app.use(express.static(path.join(rootDirectoryPath, "public")));

// SETTING UP ROUTES INTO app
app.use("/admin", adminRoutes); // adminRoutes is also a valid middleware
app.use("/", shopRoutes);

app.use(errorController.get404);

// here app is also a valid request handler
// const server = http.createServer(app);

// server.listen(3000);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
