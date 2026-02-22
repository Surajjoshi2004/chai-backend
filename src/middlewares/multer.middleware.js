//multer k wajah se ek middleware bana rhe h 


import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🟢 MULTER DESTINATION HIT →", file.originalname)
    cb(null, './public/temp')
  },
  filename: function (_req, file, cb) {
    console.log("🟢 MULTER FILENAME HIT →", file.originalname)
    cb(null, file.originalname)
  }
})
export const upload = multer({ storage: storage})







