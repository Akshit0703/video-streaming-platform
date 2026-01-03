import { v2 } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCLoudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the local file from server as the upload got failed and the file is corrupt
    return null;
  }
};

export default uploadOnCLoudinary;
