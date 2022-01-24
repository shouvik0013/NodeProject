// CORE MOUDLES
const path = require("path");

// THIRD PARTY
const express = require("express"); // EXPRESS
const bodyParser = require("body-parser"); // BODY PARSER
const mongoose = require("mongoose");

// ROUTES
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// UTILS
const rootDirectoryPath = require("./utils/path");

// MODELS
// const User = require("./models/user");

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

// app.use((req, res, next) => {
//   User.findById("61e812d7445808c3e3345bbf")
//     .then((user) => {
//       req.user = new User(user.username, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// SETTING UP ROUTES INTO app
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://devusr:ddreb0660@cluster0.fyweo.mongodb.net/Shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("CONNECTED TO MONGODB SERVER");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("ERROR CONNECTING MONGODB -> ");
    console.log(err);
  });
