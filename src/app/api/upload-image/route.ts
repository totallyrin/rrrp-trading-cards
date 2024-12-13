import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

export function getGCPCredentials() {
  return process.env.GCP_PRIVATE_KEY
    ? {
        credentials: {
          client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        projectId: process.env.GCP_PROJECT_ID,
      }
    : {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      };
}

const storage = new Storage(getGCPCredentials());

export async function POST(req: Request) {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}