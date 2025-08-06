import { NextResponse } from "next/server"

// This is a simple in-memory database. In a real application, you'd use a proper database.
const users = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
]

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

