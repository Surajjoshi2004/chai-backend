//multer k wajah se ek middleware bana rhe h 


import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(process.cwd(), "public", "temp");
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      cb(null, tempDir);
    } catch (err) {
      cb(err, tempDir);
    }
  },
  filename: function (req, file, cb) {
    const safeOriginal = (file.originalname || "upload")
      .replace(/[^\w.\-()]/g, "_")
      .slice(-120);
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}-${safeOriginal}`);
  }
})

export const upload = multer({ storage: storage})







