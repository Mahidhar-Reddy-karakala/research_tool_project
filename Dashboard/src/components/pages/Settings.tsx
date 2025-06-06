import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Lock, Eye, BellRing } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure your general application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="language">Language</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">Use compact view for dense information display</p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control your privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline">Configure</Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BellRing className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Activity Log</Label>
                  <p className="text-sm text-muted-foreground">Track all account activities</p>
                </div>
              </div>
              <Button variant="outline">View Log</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}