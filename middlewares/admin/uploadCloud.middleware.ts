import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // Tự động nhận dạng loại file
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
export const uploadToCloudinary = async (buffer: any) => {
  let result = (await streamUpload(buffer)) || "";
  return result["url"];
};
export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req["file"]) {
    const link = await uploadToCloudinary(req["file"].buffer);
    req.body[req["file"].fieldname] = link;
    next();
  } else {
    next();
  }
};
export const uploadFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  for (const key in req["files"]) {
    const links = [];
    for (const item of req["files"][key]) {
      try {
        const link = await uploadToCloudinary(item.buffer);
        links.push(link);
      } catch (error) {
        console.log(error);
      }
    }
    req.body[key] = links;
  }
  next();
};
