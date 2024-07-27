import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";

import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";

import { systemConfig } from "./config/config";
import path from "path";

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

dotenv.config();
database.connect();

app.set("views", "./views");
app.set("view engine", "pug");
// TinyMCE

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE
// tạo biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
