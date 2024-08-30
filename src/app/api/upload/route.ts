import { v2 as cloudinary } from "cloudinary";
import { stat, mkdir, writeFile, unlink } from "fs/promises";
import { join } from "path";
import { format } from "date-fns";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return new Response("No file provided", { status: 400 });
    }
    const filename = file instanceof File ? file.name : "uploaded-file";
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define the upload directory
    const uploadDir = join(
      process.cwd(),
      `/uploads/${format(Date.now(), "dd-MM-y")}`
    );

    // Ensure the upload directory exists
    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        return new Response("Error creating upload directory", { status: 500 });
      }
    }

    // Define the file path
    const filePath = join(uploadDir, filename || "uploaded-file");

    // Save the file locally
    await writeFile(filePath, new Uint8Array(buffer));

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Removing the local file after upload
    // await unlink(filePath);

    console.log(uploadResult);
    return new Response(JSON.stringify({ url: uploadResult.secure_url }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("File upload failed", { status: 500 });
  }
}
