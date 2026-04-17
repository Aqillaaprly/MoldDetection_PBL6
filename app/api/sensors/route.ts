import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export async function GET() {
  const temperature = Math.floor(Math.random() * 10) + 25
  const humidity = Math.floor(Math.random() * 30) + 60
  const light = Math.floor(Math.random() * 100)

  let status = "Safe"

  if (humidity > 75) {
    status = "High Risk"
  } else if (humidity > 60) {
    status = "Medium Risk"
  }

  const data = {
    temperature,
    humidity,
    light,
    status,
    time: new Date(),
  }

  await addDoc(collection(db, "sensors"), data)

  return Response.json(data)
}