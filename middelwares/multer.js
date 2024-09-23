import multer from "multer"
const storge = multer.memoryStorage()

export const singleUpload = multer({storge}).single("file");





