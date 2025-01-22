import { getGratitudesForDate } from "../../utils/gratitudes"
import Link from "next/link"

export default async function EntryPage({ params }: { params: { date: string } }) {
  const gratitudes = await getGratitudesForDate(params.date)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gratitudes for {params.date}</h1>
      <ul className="list-disc pl-5">
        {gratitudes.map((gratitude, index) => (
          <li key={index} className="mb-2">
            {gratitude}
          </li>
        ))}
      </ul>
      <Link href="/home" className="text-blue-500 hover:underline mt-4 inline-block">
        Back to All Entries
      </Link>
    </div>
  )
}

