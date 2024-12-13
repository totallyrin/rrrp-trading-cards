const { Storage } = require("@google-cloud/storage");

export function getGCPCredentials() {
  // for Vercel, use environment variables
  return process.env.GCP_PRIVATE_KEY
    ? {
        credentials: {
          client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY,
        },
        projectId: process.env.GCP_PROJECT_ID,
      }
    : // for local development, use gcloud CLI
      {
        keyFilename: "./rrrp-top-trumps-7192b13ed6c9.json",
      };
}

const storage = new Storage(getGCPCredentials());

export default function uploadImage(url: string) {
  let imageUrl = null;
  try {
    const imageResponse = await get(image.url, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageResponse.data, "binary");

    const fileName = `${Date.now()}_${image.name}`;
    // upload image to Google Cloud Storage
    await storage
      .bucket(process.env.BUCKET_NAME)
      .file(fileName)
      .save(imageBuffer, {
        metadata: { contentType: image.contentType },
      });

    // Create a public URL for the uploaded image
    imageUrl = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;
  } catch (error) {
    return console.error(error);
  }
  return imageUrl;
}
