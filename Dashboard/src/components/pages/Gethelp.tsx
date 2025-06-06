import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, MessageSquare, FileText, Mail } from 'lucide-react';

export default function GetHelp() {
  const helpTopics = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using the platform',
      icon: HelpCircle,
    },
    {
      title: 'Account Management',
      description: 'Manage your account settings and preferences',
      icon: FileText,
    },
    {
      title: 'Trading Guide',
      description: 'Understanding trading features and tools',
      icon: MessageSquare,
    },
    {
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to your questions and get support
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search help articles..."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {helpTopics.map((topic) => (
          <Card key={topic.title} className="cursor-pointer hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <topic.icon className="h-5 w-5" />
                <span>{topic.title}</span>
              </CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>Contact our support team for assistance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Available Monday to Friday, 9:00 AM to 6:00 PM IST
          </p>
        </CardContent>
      </Card>
    </div>
  );
}