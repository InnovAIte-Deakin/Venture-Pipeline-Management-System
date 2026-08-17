import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import type { PasswordFields, SaveStatus, UserProfile } from "../../types"
import { SaveStatusContent, SaveStatusMessage } from "./save-status-content"

interface AccountSettingsFormsProps {
  userProfile: UserProfile
  password: PasswordFields
  profileSaveStatus: SaveStatus
  passwordSaveStatus: SaveStatus
  onUserProfileChange: (profile: UserProfile) => void
  onPasswordChange: (password: PasswordFields) => void
  onProfileUpdate: () => void
  onPasswordUpdate: () => void
}

export function AccountSettingsForms({
  userProfile,
  password,
  profileSaveStatus,
  passwordSaveStatus,
  onUserProfileChange,
  onPasswordChange,
  onProfileUpdate,
  onPasswordUpdate,
}: AccountSettingsFormsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={userProfile.name}
              onChange={(event) => onUserProfileChange({ ...userProfile, name: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userProfile.email}
              onChange={(event) => onUserProfileChange({ ...userProfile, email: event.target.value })}
            />
          </div>
          <Button
            onClick={onProfileUpdate}
            disabled={profileSaveStatus === "saving"}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <SaveStatusContent
              status={profileSaveStatus}
              idleLabel="Save Profile"
              savedLabel="Saved!"
              errorLabel="Error"
            />
          </Button>
          <SaveStatusMessage
            status={profileSaveStatus}
            savingMessage="Saving profile changes..."
            savedMessage="Profile changes saved successfully."
            errorMessage="Profile changes could not be saved."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account security settings.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={password.current}
              onChange={(event) => onPasswordChange({ ...password, current: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password.new}
              onChange={(event) => onPasswordChange({ ...password, new: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={password.confirm}
              onChange={(event) => onPasswordChange({ ...password, confirm: event.target.value })}
            />
          </div>
          <Button
            onClick={onPasswordUpdate}
            disabled={passwordSaveStatus === "saving"}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <SaveStatusContent
              status={passwordSaveStatus}
              idleLabel="Change Password"
              savedLabel="Password Changed!"
              errorLabel="Error Changing Password"
            />
          </Button>
          <SaveStatusMessage
            status={passwordSaveStatus}
            savingMessage="Checking password details..."
            savedMessage="Password update completed successfully."
            errorMessage="Enter matching new passwords before saving."
          />
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Label htmlFor="two-factor">Two-Factor Authentication</Label>
            <Switch
              id="two-factor"
              checked={userProfile.twoFactorEnabled}
              onCheckedChange={(checked) => onUserProfileChange({ ...userProfile, twoFactorEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
