import multer from "multer";

const storage = multer.memoryStorage(); // Corrected property name

export const singleUpload = multer({ storage }).single("file"); // Use 'storage' instead of 'storge'
