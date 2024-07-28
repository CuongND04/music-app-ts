import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import methodOverride from "method-override";
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";

import { systemConfig } from "./config/config";
import path from "path";
import bodyParser from "body-parser";

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(methodOverride("_method"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // để đọc được json từ form

dotenv.config();
database.connect();

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
// TinyMCE

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE
// tạo biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
