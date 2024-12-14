import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import getGCPCredentials from "@/utils/getGCPCredentials";

const storage = new Storage(getGCPCredentials());

export async function POST(req: Request) {
  if (!process.env.BUCKET_NAME) {
    return NextResponse.json(
      { error: "Missing environment variable" },
      { status: 400 },
    );
  }

  try {
    const { url, contentType } = await req.json();
    if (!url || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch the image data using the built-in fetch API
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      throw new Error(
        `Failed to fetch the image. Status: ${imageResponse.status}`,
      );
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Upload the image
    const fileName = `${Date.now()}`;
    await storage
      .bucket(process.env.BUCKET_NAME)
      .file(fileName)
      .save(imageBuffer, {
        metadata: { contentType },
      });

    const imageUrl = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 },
    );
  }
}
