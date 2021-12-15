// core modules
const path = require("path");

// third-party modules
const express = require("express"); // EXPRESS
const bodyParser = require("body-parser"); // BODY PARSER

/* local modules */

// ROUTES
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// UTILS
const rootDir = require("./utils/path");
// CONTROLLERS
const errorController = require("./controllers/error");

// EXPRESS App
const app = express();

// setting templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// parses the incoming message
app.use(bodyParser.urlencoded({ extended: false })); // bodyParser is also a middleware
// exposing public folder, so we can directly access them
app.use(express.static(path.join(rootDir, "public")));

/* SETTING UP ROUTES INTO app */
app.use("/admin", adminRoutes); // adminRoutes is also a valid middleware
app.use("/", shopRoutes);

app.use(errorController.get404);

// here app is also a valid request handler
// const server = http.createServer(app);

// server.listen(3000);

app.listen(3000);
