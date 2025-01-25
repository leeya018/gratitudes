import { getGratitudesForToday } from "../utils/gratitudes";

export default async function GratitudeList() {
  const gratitudes = await getGratitudesForToday();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Today&apos;s Gratitudes:</h2>
      {gratitudes.length > 0 ? (
        <ul className="list-disc pl-5">
          {gratitudes.map((gratitude, index) => (
            <li key={index} className="mb-2">
              {gratitude}
            </li>
          ))}
        </ul>
      ) : (
        <p>No gratitudes recorded yet today. Start by adding one!</p>
      )}
    </div>
  );
}
