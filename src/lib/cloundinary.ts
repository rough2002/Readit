import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "dmtds3d8x",
  api_key: "686213662924496",
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
