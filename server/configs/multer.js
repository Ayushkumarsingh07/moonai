import multer from "multer";
export const upload = multer({ storage: multer.memoryStorage() });

const storage = multer.diskStorage({});

export const uploadDisk = multer({ storage })