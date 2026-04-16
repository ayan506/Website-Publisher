import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";

// Use memory storage — we convert to base64 and return a data URL
// so nothing is stored on disk (which would be wiped on restart/redeploy)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const allowed = ["jpeg", "jpg", "png", "gif", "webp"];
    if (allowed.includes(ext) && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router: IRouter = Router();

router.post("/upload", upload.single("file"), (req, res): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  // Convert buffer to base64 data URL — persists in the DB with no file on disk
  const mime = req.file.mimetype;
  const base64 = req.file.buffer.toString("base64");
  const dataUrl = `data:${mime};base64,${base64}`;

  res.json({ url: dataUrl });
});

export default router;
