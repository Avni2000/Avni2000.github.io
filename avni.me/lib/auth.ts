"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin"
const SESSION_COOKIE_NAME = "admin_session"

export async function login(formData: FormData) {
  const password = formData.get("password")
  if (password === ADMIN_PASSWORD) {
    const sessionValue = crypto.randomUUID()
    cookies().set(SESSION_COOKIE_NAME, sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
    redirect("/admin/dashboard")
  } else {
    return { error: "Invalid password." }
  }
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME)
  redirect("/")
}

export function isAuthenticated() {
  return !!cookies().get(SESSION_COOKIE_NAME)?.value
}
