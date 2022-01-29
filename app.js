// CORE MOUDLES
const path = require("path");

// THIRD PARTY
const express = require("express"); // EXPRESS
const bodyParser = require("body-parser"); // BODY PARSER
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// ROUTES
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// UTILS
const rootDirectoryPath = require("./utils/path");

// MODELS
const User = require("./models/user");

// CONTROLLERS
const errorController = require("./controllers/error");

const MONGODB_URI =
  "mongodb+srv://devusr:ddreb0660@cluster0.fyweo.mongodb.net/Shop?retryWrites=true&w=majority";

// EXPRESS App
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// SETTING TEMPLATING ENGINE
app.set("view engine", "ejs");
app.set("views", "views");

// PARSES INCOMMING REQUEST
app.use(bodyParser.urlencoded({ extended: false })); // bodyParser is also a middleware
// EXPOSING "public" FOLDER TO PROVIDE DIRECT ACCESS
app.use(express.static(path.join(rootDirectoryPath, "public")));
// INITIALISING SESSION FORM DATABASE
app.use(
  session({
    secret: "secret code to encrypt",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("IN APP.JS ERROR IN LOADING USER");
    });
});

// SETTING UP ROUTES INTO app
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("CONNECTED TO MONGODB SERVER");
    console.log("NODEJS SERVER IS NOW LISTENING");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("ERROR CONNECTING MONGODB -> ");
    console.log(err);
  });
