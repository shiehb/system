"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Edit, Save, X, User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react"
import { LoadingWave } from "@/components/ui/loading-wave"

const personalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  date_of_birth: z.string().optional(),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

interface PersonalInformationProps {
  profile: any
  onUpdate: (data: PersonalInfoFormValues) => Promise<void>
  isUpdating: boolean
}

export const PersonalInformation = ({ profile, onUpdate, isUpdating }: PersonalInformationProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      middle_name: profile.middle_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
      bio: profile.bio || "",
      department: profile.department || "",
      position: profile.position || "",
      date_of_birth: profile.date_of_birth || "",
    },
  })

  const handleSubmit = async (data: PersonalInfoFormValues) => {
    try {
      await onUpdate(data)
      setIsEditing(false)
      toast.success("Personal information updated successfully")
    } catch (error) {
      toast.error("Failed to update personal information")
    }
  }

  const handleCancel = () => {
    form.reset()
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Tell us about yourself..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <LoadingWave message="Saving..." />}
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Full Name</Label>
              <p className="text-sm font-medium">
                {profile.first_name} {profile.middle_name} {profile.last_name}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email
              </Label>
              <p className="text-sm">{profile.email}</p>
            </div>

            {profile.phone && (
              <div>
                <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </Label>
                <p className="text-sm">{profile.phone}</p>
              </div>
            )}

            {profile.date_of_birth && (
              <div>
                <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date of Birth
                </Label>
                <p className="text-sm">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {profile.department && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Department</Label>
                <p className="text-sm">{profile.department}</p>
              </div>
            )}

            {profile.position && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Position</Label>
                <p className="text-sm">{profile.position}</p>
              </div>
            )}

            {profile.address && (
              <div>
                <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Address
                </Label>
                <p className="text-sm">{profile.address}</p>
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <div>
            <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Bio
            </Label>
            <p className="text-sm text-gray-700 mt-1">{profile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
