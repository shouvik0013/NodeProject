// core modules
const fs = require("fs");
const path = require("path");

// third-party modules

// local modules
const rootDir = require("../utils/path");

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        const p = path.join(rootDir, "data", "products.json");
        fs.readFile(p, (err, fileContent) => {
            let products = new Array();
            if (!err) {
                products = JSON.parse(fileContent);
            }

            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        // here cb is a callback function
        const p = path.join(rootDir, "data", "products.json");
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }
};
