"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Shield,
  Eye,
  Download,
  Upload,
  Palette,
  User,
  Key,
  Save,
  RefreshCw,
  Trash2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SettingsPage() {
  const router = useRouter();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    title: "Project Name",
    description: "Project description goes here",
    visibility: "private",
    allowComments: true,
    enableNotifications: true,
    dailyDigest: false,
    mentionAlerts: true,
    taskReminders: true,
    securityLevel: "standard",
    twoFactorAuth: false,
    theme: "system"
  });

  useEffect(() => {
    // Simulate loading project settings
    const timer = setTimeout(() => {
      // This would typically be an API call to fetch project settings
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [projectId]);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  const handleResetSettings = () => {
    // Confirm before resetting
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setProjectDetails({
        title: "Project Name",
        description: "Project description goes here",
        visibility: "private",
        allowComments: true,
        enableNotifications: true,
        dailyDigest: false,
        mentionAlerts: true,
        taskReminders: true,
        securityLevel: "standard",
        twoFactorAuth: false,
        theme: "system"
      });
      toast.info("Settings reset to default");
    }
  };

  const handleDeleteProject = () => {
    // This would typically open a confirmation dialog
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      toast.error("Project deleted");
      // Navigate to projects page after deletion
      router.push("/dashboard/projects");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const ProjectGeneralSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="project-title">Project Title</Label>
        <Input 
          id="project-title" 
          value={projectDetails.title}
          onChange={(e) => setProjectDetails({...projectDetails, title: e.target.value})}
          className="max-w-md"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="project-description">Project Description</Label>
        <Textarea 
          id="project-description" 
          value={projectDetails.description}
          onChange={(e) => setProjectDetails({...projectDetails, description: e.target.value})}
          rows={4}
          className="max-w-md"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="project-visibility">Project Visibility</Label>
        <Select 
          value={projectDetails.visibility}
          onValueChange={(value) => setProjectDetails({...projectDetails, visibility: value})}
        >
          <SelectTrigger id="project-visibility" className="max-w-md">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public <span className="text-gray-500 ml-2 text-xs">(Visible to everyone)</span></SelectItem>
            <SelectItem value="private">Private <span className="text-gray-500 ml-2 text-xs">(Only visible to team)</span></SelectItem>
            <SelectItem value="restricted">Restricted <span className="text-gray-500 ml-2 text-xs">(Visible to specific users)</span></SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="allow-comments" 
          checked={projectDetails.allowComments}
          onCheckedChange={(checked) => setProjectDetails({...projectDetails, allowComments: checked})}
        />
        <Label htmlFor="allow-comments">Allow comments on tasks</Label>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <Alert className="max-w-md mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Notification settings apply to this project only
        </AlertDescription>
      </Alert>
      
      <div className="flex items-center justify-between max-w-md">
        <div className="flex items-center space-x-2">
          <Switch 
            id="enable-notifications" 
            checked={projectDetails.enableNotifications}
            onCheckedChange={(checked) => setProjectDetails({...projectDetails, enableNotifications: checked})}
          />
          <Label htmlFor="enable-notifications">Enable all notifications</Label>
        </div>
        <Badge variant={projectDetails.enableNotifications ? "default" : "outline"}>
          {projectDetails.enableNotifications ? "Enabled" : "Disabled"}
        </Badge>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4 max-w-md">
        <h4 className="text-sm font-medium">Notification Types</h4>
        
        <div className="flex items-center justify-between pl-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="daily-digest" 
              checked={projectDetails.dailyDigest}
              onCheckedChange={(checked) => setProjectDetails({...projectDetails, dailyDigest: checked})}
              disabled={!projectDetails.enableNotifications}
            />
            <Label htmlFor="daily-digest" className={!projectDetails.enableNotifications ? "text-gray-400" : ""}>
              Daily digest
            </Label>
          </div>
        </div>
        
        <div className="flex items-center justify-between pl-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="mention-alerts" 
              checked={projectDetails.mentionAlerts}
              onCheckedChange={(checked) => setProjectDetails({...projectDetails, mentionAlerts: checked})}
              disabled={!projectDetails.enableNotifications}
            />
            <Label htmlFor="mention-alerts" className={!projectDetails.enableNotifications ? "text-gray-400" : ""}>
              @Mention alerts
            </Label>
          </div>
        </div>
        
        <div className="flex items-center justify-between pl-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="task-reminders" 
              checked={projectDetails.taskReminders}
              onCheckedChange={(checked) => setProjectDetails({...projectDetails, taskReminders: checked})}
              disabled={!projectDetails.enableNotifications}
            />
            <Label htmlFor="task-reminders" className={!projectDetails.enableNotifications ? "text-gray-400" : ""}>
              Task deadline reminders
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="security-level">Security Level</Label>
        <Select 
          value={projectDetails.securityLevel}
          onValueChange={(value) => setProjectDetails({...projectDetails, securityLevel: value})}
        >
          <SelectTrigger id="security-level" className="max-w-md">
            <SelectValue placeholder="Select security level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="enhanced">Enhanced</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          {projectDetails.securityLevel === "basic" && "Basic security includes standard encryption and authentication."}
          {projectDetails.securityLevel === "standard" && "Standard security adds IP restrictions and audit logs."}
          {projectDetails.securityLevel === "enhanced" && "Enhanced security adds extra verification and advanced encryption."}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="two-factor-auth" 
          checked={projectDetails.twoFactorAuth}
          onCheckedChange={(checked) => setProjectDetails({...projectDetails, twoFactorAuth: checked})}
        />
        <Label htmlFor="two-factor-auth">Require two-factor authentication for all members</Label>
      </div>
      
      <div className="pt-4">
        <h4 className="text-sm font-medium mb-2">Project Access Logs</h4>
        <Button variant="outline" size="sm" className="text-xs">
          View Access Logs
        </Button>
      </div>
    </div>
  );

  const DataSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export Project Data</CardTitle>
          <CardDescription>Download all project data in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              JSON
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import Data</CardTitle>
          <CardDescription>Import data from another project or service</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Select File to Import
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border-orange-200">
        <CardHeader className="text-orange-700">
          <CardTitle className="text-base">Danger Zone</CardTitle>
          <CardDescription className="text-orange-600">Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="destructive" 
            className="w-full sm:w-auto"
            onClick={handleDeleteProject}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const AppearanceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme-select">Application Theme</Label>
        <Select 
          value={projectDetails.theme}
          onValueChange={(value) => setProjectDetails({...projectDetails, theme: value})}
        >
          <SelectTrigger id="theme-select" className="max-w-md">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mt-4">
        <div className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors ${projectDetails.theme === 'light' ? 'border-blue-500 bg-blue-50' : ''}`}
          onClick={() => setProjectDetails({...projectDetails, theme: 'light'})}>
          <div className="h-20 bg-white border mb-2 rounded"></div>
          <p className="text-center text-sm">Light</p>
        </div>
        
        <div className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors ${projectDetails.theme === 'dark' ? 'border-blue-500 bg-blue-50' : ''}`}
          onClick={() => setProjectDetails({...projectDetails, theme: 'dark'})}>
          <div className="h-20 bg-gray-800 border mb-2 rounded"></div>
          <p className="text-center text-sm">Dark</p>
        </div>
        
        <div className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors ${projectDetails.theme === 'system' ? 'border-blue-500 bg-blue-50' : ''}`}
          onClick={() => setProjectDetails({...projectDetails, theme: 'system'})}>
          <div className="h-20 bg-gradient-to-r from-white to-gray-800 border mb-2 rounded"></div>
          <p className="text-center text-sm">System</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Project Settings</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2"
            onClick={handleResetSettings}
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectGeneralSettings />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AppearanceSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SecuritySettings />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-white">
          <ResizablePanel defaultSize={25} minSize={15} maxSize={30} className="p-0">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b font-medium">Settings</div>
              <div className="flex-1 overflow-auto">
                <nav className="p-2">
                  <ul className="space-y-1">
                    <li>
                      <Button variant="ghost" className="w-full justify-start text-left">
                        <Settings className="h-4 w-4 mr-2" />
                        General
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start text-left">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start text-left">
                        <Shield className="h-4 w-4 mr-2" />
                        Security & Privacy
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start text-left">
                        <User className="h-4 w-4 mr-2" />
                        Members
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start text-left">
                        <Key className="h-4 w-4 mr-2" />
                        API Keys
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start text-left">
                        <Download className="h-4 w-4 mr-2" />
                        Data
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start text-left">
                        <Palette className="h-4 w-4 mr-2" />
                        Appearance
                      </Button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75} className="p-0">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b font-medium">General Settings</div>
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto space-y-10">
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      General Settings
                    </h2>
                    <ProjectGeneralSettings />
                  </section>
                  
                  <Separator />
                  
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Settings
                    </h2>
                    <NotificationSettings />
                  </section>
                  
                  <Separator />
                  
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security & Privacy
                    </h2>
                    <SecuritySettings />
                  </section>
                  
                  <Separator />
                  
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Data Management
                    </h2>
                    <DataSettings />
                  </section>
                  
                  <Separator />
                  
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance
                    </h2>
                    <AppearanceSettings />
                  </section>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default SettingsPage;