import { NextResponse } from "next/server";
import { getGratitudeCountForToday } from "../../../utils/gratitudes";
import { auth } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const count = await getGratitudeCountForToday(userId);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting gratitude count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
