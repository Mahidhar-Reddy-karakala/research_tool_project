import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Package, Shield } from 'lucide-react';

export default function Billing() {
  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Free plan</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Free Plan</p>
                  <p className="text-sm text-muted-foreground">0 Rupees/month</p>
                </div>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Included Features:</h4>
              <ul className="grid gap-3 text-sm">
                <li className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Real-time market data
                </li>
                <li className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Portfolio tracking
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                <CreditCard className="h-6 w-6" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/24</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <Button variant="outline" className="w-full">Add Payment Method</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}