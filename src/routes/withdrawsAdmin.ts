import express from "express";
import mime from "mime-types";
import multer from "multer";
import WithdrawController from "../controllers/WithdrawController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "storage/images");
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(
      null,
      file.fieldname + "-" + uniqueSuffix + `.${mime.extension(file.mimetype)}`
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter(req, file, callback) {
    const mime = file.mimetype;
    const split = mime.split("/");
    if (split[0] && split[0] == "image") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});
const router = express.Router();

router.use("/withdraws", authMiddleware);
router.get("/withdraws", can("withdraws-read"), WithdrawController.adminGet);
router.get("/withdraws/:withdrawId", can("withdraws-read"), WithdrawController.adminGetDetail);
router.patch(
  "/withdraws/:withdrawId/accept",
  can("withdraws-update"),
  upload.single("image"),
  WithdrawController.adminAccept
);

export default router;
