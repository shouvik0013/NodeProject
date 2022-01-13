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

// MODELS
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItems = require("./models/cart-item");
const Order = require('./models/order');
const OrderItems = require('./models/order-item');

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

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// SETTING UP ROUTES INTO app
app.use("/admin", adminRoutes); // adminRoutes is also a valid middleware
app.use("/", shopRoutes);

app.use(errorController.get404);

// IN CREATING SENSE. A PRODUCT IS ADDED BY ONE USER
// AND AN USER CAN ADD MULTIPLE PRODUCTS
User.hasMany(Product);
Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});

// ASSOCIATION BETWEEN USER & CART
User.hasOne(Cart);
Cart.belongsTo(User);

// ASSOCIATION BETWEEN PRODUCT & CART
Product.belongsToMany(Cart, { through: CartItems });
Cart.belongsToMany(Product, { through: CartItems });


// ASSOCIATION BETWEEN USER, PRODUCT, ORDER, ORDERITEM
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItems });
Product.belongsToMany(Order, { through: OrderItems });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1); // THIS LINE ALSO RETURNS A PROMISE
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Shouvik",
        email: "shouvik0013@gmail.com",
      });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    console.log(user);
    return user.createCart()
  })
  .then(cart => {
    console.log(cart);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
