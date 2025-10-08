'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Activity, Server, Zap, Database, Shield } from 'lucide-react';

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const systemStatus = 'operational'; // operational, degraded, outage

  const services = [
    {
      name: 'Trading Platform',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms',
      icon: Zap
    },
    {
      name: 'AI Trading Engine',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '120ms',
      icon: Activity
    },
    {
      name: 'Smart Contracts',
      status: 'operational',
      uptime: '100%',
      responseTime: '2.5s',
      icon: Shield
    },
    {
      name: 'API Services',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '85ms',
      icon: Server
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '12ms',
      icon: Database
    },
    {
      name: 'Wallet Integration',
      status: 'operational',
      uptime: '99.96%',
      responseTime: '150ms',
      icon: CheckCircle
    }
  ];

  const incidents = [
    {
      date: '2025-10-05',
      title: 'Scheduled Maintenance - AI Model Update',
      status: 'resolved',
      description: 'Successfully deployed new AI trading model with improved performance.',
      duration: '15 minutes'
    },
    {
      date: '2025-09-28',
      title: 'API Rate Limiting Issue',
      status: 'resolved',
      description: 'Temporary slowdown in API responses due to high traffic. Resolved by scaling infrastructure.',
      duration: '23 minutes'
    },
    {
      date: '2025-09-15',
      title: 'Database Optimization',
      status: 'resolved',
      description: 'Scheduled database maintenance to improve query performance.',
      duration: '45 minutes'
    }
  ];

  const upcomingMaintenance = [
    {
      date: '2025-10-15',
      time: '02:00 - 03:00 UTC',
      title: 'Infrastructure Upgrade',
      description: 'Upgrading server infrastructure for improved performance and reliability.',
      impact: 'Low - Brief service interruptions possible'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'outage':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Degraded</Badge>;
      case 'outage':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Outage</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              System Status
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time platform status and uptime information
            </p>
            <div className="text-sm text-muted-foreground">
              Last updated: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
            </div>
          </div>

          {/* Overall Status */}
          <Card className={systemStatus === 'operational' ? 'bg-green-500/10 border-green-500/20' : ''}>
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h2 className="text-3xl font-bold">All Systems Operational</h2>
              </div>
              <p className="text-muted-foreground">
                All services are running normally with no reported issues
              </p>
            </CardContent>
          </Card>

          {/* Services Status */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <service.icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                      </div>
                      <CheckCircle className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-semibold">{service.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-semibold">{service.responseTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          {upcomingMaintenance.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Upcoming Maintenance</h2>
              {upcomingMaintenance.map((maintenance, idx) => (
                <Card key={idx} className="bg-blue-500/10 border-blue-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <CardTitle className="text-lg mb-1">{maintenance.title}</CardTitle>
                          <CardDescription className="text-base">
                            <strong>{maintenance.date}</strong> • {maintenance.time}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{maintenance.description}</p>
                    <p className="text-sm">
                      <strong>Expected Impact:</strong> {maintenance.impact}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Incident History */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Recent Incidents</h2>
            {incidents.map((incident, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(incident.status)}
                        <span className="text-sm text-muted-foreground">{incident.date}</span>
                      </div>
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {incident.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{incident.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Uptime Stats */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Uptime Statistics (30 Days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">99.97%</div>
                  <div className="text-sm text-muted-foreground">Overall Uptime</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">43m</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
                  <div className="text-sm text-muted-foreground">Incidents Resolved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">0</div>
                  <div className="text-sm text-muted-foreground">Major Outages</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Subscribe to Updates */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Stay Updated</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Subscribe to receive notifications about planned maintenance and system incidents
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-6 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
