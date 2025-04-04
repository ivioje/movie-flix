
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { updateUserPreferences, getUserData } from "@/services/userServices";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/theme-provider";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserProfile } from "@clerk/clerk-react";

const Settings = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ['userSettings', user?.id],
    queryFn: () => getUserData(user?.id as string),
    enabled: !!user?.id,
  });
  
  const userPreferences = userData?.preferences || {};
  
  const [preferences, setPreferences] = useState({
    favoriteGenre: userPreferences.favoriteGenre || "",
    notifications: userPreferences.notifications || false,
    emailUpdates: userPreferences.emailUpdates || false,
    subtitlesLanguage: userPreferences.subtitlesLanguage || "english",
    contentRating: userPreferences.contentRating || "pg13",
    bio: userPreferences.bio || "",
  });
  
  const handleSavePreferences = async () => {
    try {
      await updateUserPreferences(user!.id, preferences);
      toast({
        title: "Preferences updated",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Settings" 
        description="Manage your account preferences" 
      />
      
      <div className="grid gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your profile information and account security
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="px-6">
              <UserProfile />
            </div>
          </CardContent>
        </Card>
        
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how MovieFlix looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <RadioGroup
                  defaultValue={theme}
                  onValueChange={(value) => setTheme(value as "dark" | "light" | "system")}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="cursor-pointer">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="cursor-pointer">System</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Content Preferences</CardTitle>
            <CardDescription>
              Personalize your movie and TV show experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="favoriteGenre">Favorite Genre</Label>
                <Select
                  value={preferences.favoriteGenre}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, favoriteGenre: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="crime">Crime</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                    <SelectItem value="thriller">Thriller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentRating">Content Rating Preference</Label>
                <Select
                  value={preferences.contentRating}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, contentRating: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">G (General Audiences)</SelectItem>
                    <SelectItem value="pg">PG (Parental Guidance)</SelectItem>
                    <SelectItem value="pg13">PG-13 (Parents Strongly Cautioned)</SelectItem>
                    <SelectItem value="r">R (Restricted)</SelectItem>
                    <SelectItem value="nc17">NC-17 (Adults Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitlesLanguage">Subtitles Language</Label>
                <Select
                  value={preferences.subtitlesLanguage}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, subtitlesLanguage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subtitles language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and your movie preferences..."
                  value={preferences.bio}
                  onChange={(e) => setPreferences(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </CardFooter>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">In-app Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about new releases and recommendations
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly emails about new content and features
                  </p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={preferences.emailUpdates}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailUpdates: checked }))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePreferences}>Save Notification Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
