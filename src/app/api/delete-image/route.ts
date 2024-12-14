import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import getGCPCredentials from "@/utils/getGCPCredentials";

const storage = new Storage(getGCPCredentials());

// Function to extract filename from URL
function getFileNameFromUrl(url: string): string {
  const path = new URL(url).pathname; // Get the path part of the URL
  const fileName = path.substring(path.lastIndexOf("/") + 1); // Extract filename after the last '/'
  return fileName;
}

export async function POST(req: Request) {
  if (!process.env.BUCKET_NAME) {
    return NextResponse.json(
      { error: "Missing environment variable" },
      { status: 400 },
    );
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Extract the file name from the URL
    const fileName = getFileNameFromUrl(url);

    // Delete the image from Google Cloud Storage
    await storage.bucket(process.env.BUCKET_NAME).file(fileName).delete();

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 },
    );
  }
}
