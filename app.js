// CORE MOUDLES
const path = require("path");

// THIRD PARTY
const express = require("express"); // EXPRESS
const bodyParser = require("body-parser"); // BODY PARSER
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const random_hash = require("random-hash");

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

const csrfProtection = csrf(); // IT USES SESSION BY DEFAULT

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      random_hash.generateHash({ length: 12 }) + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// SETTING TEMPLATING ENGINE
app.set("view engine", "ejs");
app.set("views", "views");

// PARSES INCOMMING REQUEST
app.use(bodyParser.urlencoded({ extended: false })); // bodyParser is also a middleware
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")  // "image" name of the input field
);

// EXPOSING "public" FOLDER TO PROVIDE DIRECT ACCESS
app.use(express.static(path.join(rootDirectoryPath, "public")));
app.use("/images", express.static(path.join(rootDirectoryPath, "images")));
// INITIALISING SESSION FORM DATABASE
app.use(
  session({
    secret: "secret code to encrypt",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection); // BY DEFAULT IT USES SESSION, SO NEEDS TO BE ADDED AFTER SESSION INITIALIZATION
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      // throw new Error(err);
      next(new Error(err));
    });
});

// SETTING UP ROUTES INTO app
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);


app.use((error, req, res, next) => {
  console.log(error.message)
  res.render("500", {
    pageTitle: "Technical Error",
    path: "505",
    isAuthenticated: req.session.isLoggedIn,
  });
});

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
