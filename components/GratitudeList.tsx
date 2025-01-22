import { getGratitudesForToday } from "../utils/gratitudes";

export default async function GratitudeList() {
  const gratitudes = await getGratitudesForToday();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Todays Gratitudes:</h2>
      <ul className="list-disc pl-5">
        {gratitudes.map((gratitude, index) => (
          <li key={index} className="mb-2">
            {gratitude}
          </li>
        ))}
      </ul>
    </div>
  );
}
