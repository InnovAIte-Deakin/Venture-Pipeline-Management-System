import type { ChangeEvent } from "react"
import { AlertCircle, Database, Download, Upload } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import type { DataSettings, SaveStatus } from "../../types"
import { SaveStatusMessage } from "./save-status-content"

interface DataManagementFormProps {
  dataSettings: DataSettings
  dataSaveStatus: SaveStatus
  onDataSettingsChange: (settings: DataSettings) => void
  onDataExport: () => void
  onDataImport: (event: ChangeEvent<HTMLInputElement>) => void
}

export function DataManagementForm({
  dataSettings,
  dataSaveStatus,
  onDataSettingsChange,
  onDataExport,
  onDataImport,
}: DataManagementFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your data, backups, and exports.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Backup Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-backup">Auto Backup</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup your data</p>
              </div>
              <Switch
                id="auto-backup"
                checked={dataSettings.autoBackup}
                onCheckedChange={(checked) => onDataSettingsChange({ ...dataSettings, autoBackup: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select
                value={dataSettings.backupFrequency}
                onValueChange={(value) =>
                  onDataSettingsChange({
                    ...dataSettings,
                    backupFrequency: value as DataSettings["backupFrequency"],
                  })
                }
              >
                <SelectTrigger id="backup-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention</Label>
              <Select
                value={dataSettings.dataRetention}
                onValueChange={(value) =>
                  onDataSettingsChange({
                    ...dataSettings,
                    dataRetention: value as DataSettings["dataRetention"],
                  })
                }
              >
                <SelectTrigger id="data-retention">
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Export & Import</h3>

            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select
                value={dataSettings.exportFormat}
                onValueChange={(value) =>
                  onDataSettingsChange({
                    ...dataSettings,
                    exportFormat: value as DataSettings["exportFormat"],
                  })
                }
              >
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Button
                onClick={onDataExport}
                disabled={dataSaveStatus === "saving"}
                className="w-full"
                variant="outline"
              >
                {dataSaveStatus === "saving" ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </>
                )}
              </Button>

              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  disabled={dataSaveStatus === "saving"}
                  onChange={onDataImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full" disabled={dataSaveStatus === "saving"}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Settings
                </Button>
              </div>
              <SaveStatusMessage
                status={dataSaveStatus}
                savingMessage="Processing settings data..."
                savedMessage="Settings data processed successfully."
                errorMessage="Settings data could not be processed."
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Data Privacy Notice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your data is stored locally and encrypted. Exports contain sensitive information - handle with care.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
