import { NextResponse } from "next/server"
import { getGratitudeCountForToday } from "../../../utils/gratitudes"

export async function GET() {
  const count = await getGratitudeCountForToday()
  return NextResponse.json({ count })
}

