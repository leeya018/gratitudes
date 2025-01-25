import { NextResponse } from "next/server";
import { addGratitude } from "../../utils/gratitudes";
import { auth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { gratitude } = await request.json();

    if (!gratitude) {
      return NextResponse.json(
        { error: "Gratitude is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    await addGratitude(userId, gratitude);

    return NextResponse.json({ message: "Gratitude added successfully" });
  } catch (error) {
    console.error("Error adding gratitude:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
