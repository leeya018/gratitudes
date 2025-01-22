import Link from "next/link"
import { getAllDates } from "../utils/gratitudes"

export default async function Home() {
  const dates = await getAllDates()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gratitude Journal Entries</h1>
      <ul className="space-y-2">
        {dates.map((date) => (
          <li key={date}>
            <Link href={`/entries/${date}`} className="text-blue-500 hover:underline">
              {date}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
        Back to Today's Entry
      </Link>
    </div>
  )
}

