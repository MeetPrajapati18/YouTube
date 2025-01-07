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






// import multer from 'multer';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/temp');
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
// });

// export { upload };