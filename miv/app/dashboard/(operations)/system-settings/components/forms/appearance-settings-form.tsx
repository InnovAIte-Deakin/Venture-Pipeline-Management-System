import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "../ui/separator"
import { Laptop, Moon, Palette, Sun } from "lucide-react"

import type { AppearanceSettings, SaveStatus } from "../../types"
import { SaveStatusContent, SaveStatusMessage } from "./save-status-content"

interface AppearanceSettingsFormProps {
  appearanceSettings: AppearanceSettings
  appearanceSaveStatus: SaveStatus
  onAppearanceSettingsChange: (settings: AppearanceSettings) => void
  onAppearanceUpdate: () => void
}

export function AppearanceSettingsForm({
  appearanceSettings,
  appearanceSaveStatus,
  onAppearanceSettingsChange,
  onAppearanceUpdate,
}: AppearanceSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize the appearance of your application.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={appearanceSettings.theme === "light" ? "default" : "outline"}
                onClick={() => onAppearanceSettingsChange({ ...appearanceSettings, theme: "light" })}
                className="flex flex-col gap-2 h-20"
              >
                <Sun className="h-5 w-5" />
                Light
              </Button>
              <Button
                variant={appearanceSettings.theme === "dark" ? "default" : "outline"}
                onClick={() => onAppearanceSettingsChange({ ...appearanceSettings, theme: "dark" })}
                className="flex flex-col gap-2 h-20"
              >
                <Moon className="h-5 w-5" />
                Dark
              </Button>
              <Button
                variant={appearanceSettings.theme === "system" ? "default" : "outline"}
                onClick={() => onAppearanceSettingsChange({ ...appearanceSettings, theme: "system" })}
                className="flex flex-col gap-2 h-20"
              >
                <Laptop className="h-5 w-5" />
                System
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="accent-color"
                type="color"
                value={appearanceSettings.accentColor}
                onChange={(event) =>
                  onAppearanceSettingsChange({ ...appearanceSettings, accentColor: event.target.value })
                }
                className="w-16 h-10 p-1"
              />
              <span className="text-sm text-gray-600">{appearanceSettings.accentColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use smaller spacing and components</p>
            </div>
            <Switch
              id="compact-mode"
              checked={appearanceSettings.compactMode}
              onCheckedChange={(checked) => onAppearanceSettingsChange({ ...appearanceSettings, compactMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-animations">Show Animations</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable smooth transitions and animations</p>
            </div>
            <Switch
              id="show-animations"
              checked={appearanceSettings.showAnimations}
              onCheckedChange={(checked) =>
                onAppearanceSettingsChange({ ...appearanceSettings, showAnimations: checked })
              }
            />
          </div>
        </div>

        <Button
          onClick={onAppearanceUpdate}
          disabled={appearanceSaveStatus === "saving"}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <SaveStatusContent
            status={appearanceSaveStatus}
            idleLabel="Save Appearance"
            savedLabel="Settings Saved!"
            errorLabel="Error Saving"
          />
        </Button>
        <SaveStatusMessage
          status={appearanceSaveStatus}
          savedMessage="Appearance settings saved successfully."
          errorMessage="Appearance settings could not be saved."
        />
      </CardContent>
    </Card>
  )
}
