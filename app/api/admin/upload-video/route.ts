import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getCurrentAdmin } from "@/lib/session";

const MAX_VIDEO_BYTES = 300 * 1024 * 1024; // 300 Mo

// Génère un token d'upload à durée limitée : le fichier vidéo part ensuite
// directement du navigateur vers Vercel Blob (pas via cette route), pour
// contourner la limite de taille de requête des fonctions serverless.
export async function POST(request: Request): Promise<NextResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"],
        maximumSizeInBytes: MAX_VIDEO_BYTES,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Échec de l'envoi." },
      { status: 400 }
    );
  }
}
