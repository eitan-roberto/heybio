'use client';

import { useState } from 'react';
import { Icon, IconSize } from '@/components/ui/icon';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Demo data
const DEMO_USER: {
  email: string;
  name: string;
  plan: 'free' | 'pro';
  createdAt: string;
} = {
  email: 'demo@heybio.co',
  name: 'Demo User',
  plan: 'free',
  createdAt: '2026-01-15',
};

export default function SettingsPage() {
  const [name, setName] = useState(DEMO_USER.name);
  const [email, setEmail] = useState(DEMO_USER.email);
  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'danger'>('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: 'user' },
    { id: 'billing', label: 'Billing', icon: 'credit-card' },
    { id: 'danger', label: 'Danger Zone', icon: 'shield' },
  ] as const;

  return (
    <DashboardLayout pageSlug="demo">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-top">Settings</h1>
          <p className="text-top mt-1">
            Manage your account and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <nav className="w-full lg:w-48 flex-shrink-0">
            <ul className="flex lg:flex-col gap-1">
              {tabs.map((tab) => {
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-low text-top"
                          : "text-top hover:bg-bottom hover:text-top",
                        tab.id === 'danger' && "text-red-600 hover:text-red-700"
                      )}
                    >
                      <Icon icon={tab.icon} className="w-4 h-4" />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'account' && (
              <>
                {/* Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Button>
                      <Icon icon="save" className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                {/* Password */}
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'billing' && (
              <>
                {/* Current plan */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your subscription details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4rounded-lg">
                      <div>
                        <p className="font-semibold text-top">
                          {DEMO_USER.plan === 'pro' ? 'Pro' : 'Free'} Plan
                        </p>
                        <p className="text-sm text-top">
                          {DEMO_USER.plan === 'pro' 
                            ? '$4/month • Next billing date: Feb 15, 2026'
                            : 'Limited features'
                          }
                        </p>
                      </div>
                      {DEMO_USER.plan === 'free' ? (
                        <Button>Upgrade to Pro</Button>
                      ) : (
                        <Button variant="outline">Manage Subscription</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Your saved payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {DEMO_USER.plan === 'pro' ? (
                      <div className="flex items-center justify-between p-4rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-low rounded">
                            <Icon icon="credit-card" className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-top">•••• •••• •••• 4242</p>
                            <p className="text-sm text-top">Expires 12/28</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    ) : (
                      <p className="text-top text-sm">
                        No payment method saved. Add one when you upgrade to Pro.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Billing history */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Your past invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-top text-sm">
                      No invoices yet.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'danger' && (
              <>
                {/* Sign out */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sign Out</CardTitle>
                    <CardDescription>Sign out of your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">
                      <Icon icon="log-out" className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>

                {/* Delete account */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Delete Account</CardTitle>
                    <CardDescription>
                      Permanently delete your account and all data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-top mb-4">
                      This action cannot be undone. Your bio page will be removed and your
                      username will become available for others to claim.
                    </p>
                    <Button variant="destructive">
                      <Icon icon="trash-2" className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
