import fs from "fs/promises";
import path from "path";

const GRATITUDES_DIR = path.join(process.cwd(), "gratitudes");

export async function getGratitudesForToday(): Promise<string[]> {
  const today = new Date().toISOString().split("T")[0];
  const filePath = path.join(GRATITUDES_DIR, `${today}.json`);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addGratitude(gratitude: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const filePath = path.join(GRATITUDES_DIR, `${today}.json`);

  let gratitudes: string[] = [];

  try {
    const data = await fs.readFile(filePath, "utf-8");
    gratitudes = JSON.parse(data);
  } catch (error) {
    console.log(error);

    // File doesn't exist yet, that's okay
  }

  gratitudes.push(gratitude);

  await fs.mkdir(GRATITUDES_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(gratitudes, null, 2));
}

export async function getAllDates(): Promise<string[]> {
  const files = await fs.readdir(GRATITUDES_DIR);
  return files
    .map((file) => file.replace(".json", ""))
    .sort()
    .reverse();
}

export async function getGratitudesForDate(date: string): Promise<string[]> {
  const filePath = path.join(GRATITUDES_DIR, `${date}.json`);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function getGratitudeCountForToday(): Promise<number> {
  const gratitudes = await getGratitudesForToday();
  return gratitudes.length;
}
