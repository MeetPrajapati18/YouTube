import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("Destination: ", file);
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // console.log("Filename: ", file);
    cb(null, file.originalname)
  }
})

export const upload = multer({
  storage,
})