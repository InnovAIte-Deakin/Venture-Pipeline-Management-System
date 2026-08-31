import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accessibility } from "lucide-react"

import type { AccessibilitySettings, SaveStatus } from "../../types"
import { SaveStatusContent, SaveStatusMessage } from "./save-status-content"

interface AccessibilitySettingsFormProps {
  accessibilitySettings: AccessibilitySettings
  accessibilitySaveStatus: SaveStatus
  onAccessibilitySettingsChange: (settings: AccessibilitySettings) => void
  onAccessibilityUpdate: () => void
}

export function AccessibilitySettingsForm({
  accessibilitySettings,
  accessibilitySaveStatus,
  onAccessibilitySettingsChange,
  onAccessibilityUpdate,
}: AccessibilitySettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure accessibility options to improve usability.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select
              value={accessibilitySettings.fontSize}
              onValueChange={(value) =>
                onAccessibilitySettingsChange({
                  ...accessibilitySettings,
                  fontSize: value as AccessibilitySettings["fontSize"],
                })
              }
            >
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (14px)</SelectItem>
                <SelectItem value="medium">Medium (16px)</SelectItem>
                <SelectItem value="large">Large (18px)</SelectItem>
                <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Increase contrast for better visibility</p>
            </div>
            <Switch
              id="high-contrast"
              checked={accessibilitySettings.highContrast}
              onCheckedChange={(checked) =>
                onAccessibilitySettingsChange({ ...accessibilitySettings, highContrast: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="reduce-motion">Reduce Motion</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minimize animations and transitions</p>
            </div>
            <Switch
              id="reduce-motion"
              checked={accessibilitySettings.reduceMotion}
              onCheckedChange={(checked) =>
                onAccessibilitySettingsChange({ ...accessibilitySettings, reduceMotion: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="screen-reader">Screen Reader Optimization</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Optimize interface for screen readers</p>
            </div>
            <Switch
              id="screen-reader"
              checked={accessibilitySettings.screenReader}
              onCheckedChange={(checked) =>
                onAccessibilitySettingsChange({ ...accessibilitySettings, screenReader: checked })
              }
            />
          </div>
        </div>

        <Button
          onClick={onAccessibilityUpdate}
          disabled={accessibilitySaveStatus === "saving"}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <SaveStatusContent
            status={accessibilitySaveStatus}
            idleLabel="Save Accessibility"
            savedLabel="Settings Saved!"
            errorLabel="Error Saving"
          />
        </Button>
        <SaveStatusMessage
          status={accessibilitySaveStatus}
          savedMessage="Accessibility settings saved successfully."
          errorMessage="Accessibility settings could not be saved."
        />
      </CardContent>
    </Card>
  )
}
