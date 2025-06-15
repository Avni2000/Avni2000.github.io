"use client"
import { login } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "react-dom"

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(login, undefined)

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
