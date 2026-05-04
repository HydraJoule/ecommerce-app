"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
}

export function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (error) throw error
          setProfile(data)
          setFullName(data.full_name || "")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  const handleUpdateProfile = async () => {
    if (!profile) return

    try {
      const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id)

      if (error) throw error

      setProfile({ ...profile, full_name: fullName })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center">Profile not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={profile.email} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            {isEditing ? (
              <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            ) : (
              <Input id="fullName" type="text" value={profile.full_name || ""} disabled />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Account Type</Label>
            <Input id="role" type="text" value={profile.role} disabled />
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
