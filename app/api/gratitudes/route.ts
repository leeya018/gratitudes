import { NextResponse } from "next/server"
import { addGratitude } from "../../utils/gratitudes"

export async function POST(request: Request) {
  const { gratitude } = await request.json()

  if (!gratitude) {
    return NextResponse.json({ error: "Gratitude is required" }, { status: 400 })
  }

  await addGratitude(gratitude)

  return NextResponse.json({ message: "Gratitude added successfully" })
}

