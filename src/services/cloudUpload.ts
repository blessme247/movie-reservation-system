import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "../config/env";
import { allowedFileTypes, cloudinaryAssestFolderName, fileSizeLimit } from "../lib/constants";
import { handleError } from "../lib/utils/handleError";


cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    
    if (!allowedFileTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"));
    }
    cb(null, true);
};

const upload = (fieldName: string) =>
    multer({ storage, limits: { fileSize: fileSizeLimit }, fileFilter }).single(fieldName);


const uploadAdapter = (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
  upload(fieldName)
  (req, res, (error: any) => {
    if(!req.file){
        return handleError(req, res, 400, { message: "poster image is required" });
    }
     if (error instanceof multer.MulterError) {
        return handleError(req, res, 400, { message: error.message }); // e.g. "File too large"
    }
    if (error) {
        return handleError(req, res, 400, { message: error.message });
    }
    // Everything went fine.
    next();
  });
};

const uploadToCloud = async (req: Request) => {
  try {
    const result: UploadApiResponse | undefined = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: cloudinaryAssestFolderName,  },
          (error, uploadResult) => {
            if (error) {
              console.log(error, 'error uploading to cloudinary')
              return  { result: null, error: error.message || "Error uploading file." };
            }
            // console.log(uploadResult, 'uploadResult')
            return resolve(uploadResult);
          }
        )
        .end(req?.file?.buffer);
    });

    if (result && result.secure_url) {
    
      return { result, error: null}
    }
    return { result: null, error: "Upload succeeded but no URL returned" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "cloud service upload error";
    return {  result: null, error: errorMessage };
  }
};


export { uploadAdapter, uploadToCloud };
