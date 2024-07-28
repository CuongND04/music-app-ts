import multer from "multer";
import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/upload.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer(); // cái này phải ở dưới upload cloud

router.post(
  "/",
  upload.single("file"),
  uploadCloud.uploadSingle,
  controller.index
);

export const uploadRoutes: Router = router;
