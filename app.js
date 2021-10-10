// core modules
const path = require("path");

// third-party modules
const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

// local modules
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./utils/path");

// express app
const app = express();

// setting templating engine
app.engine(
  "handlebars",
  expressHbs({ layoutsDir: "views/layouts/", defaultLayout: "main-layout" })
);
app.set("view engine", "handlebars");
app.set("views", "views");

// parses the incoming message
app.use(bodyParser.urlencoded({ extended: false }));
// exposes public folder publically, so we can directly access them
app.use(express.static(path.join(rootDir, "public")));

// adminData.routes is also a valid middleware
app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).send('<h1>Requested page not found</h1>');
  res.status(404).render("404", { pageTitle: "Page not found" });
});

// here app is also a valid request handler
// const server = http.createServer(app);

// server.listen(3000);

app.listen(3000);
