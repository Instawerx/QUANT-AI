'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageCircle, Users, Trophy, Zap } from 'lucide-react';
import { FaDiscord, FaTwitter, FaTelegram, FaReddit } from 'react-icons/fa';

export default function CommunityPage() {
  const platforms = [
    {
      name: 'Discord',
      icon: FaDiscord,
      description: 'Join our active community for real-time discussions, trading signals, and support',
      members: '15,000+',
      color: 'text-[#5865F2]',
      bgColor: 'bg-[#5865F2]/10',
      link: 'https://discord.gg/quanttradeai'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      description: 'Follow us for updates, market insights, and announcements',
      members: '25,000+',
      color: 'text-[#1DA1F2]',
      bgColor: 'bg-[#1DA1F2]/10',
      link: 'https://twitter.com/quanttradeai'
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      description: 'Get instant alerts, participate in AMAs, and connect with traders',
      members: '30,000+',
      color: 'text-[#0088cc]',
      bgColor: 'bg-[#0088cc]/10',
      link: 'https://t.me/quanttradeai'
    },
    {
      name: 'Reddit',
      icon: FaReddit,
      description: 'Share strategies, discuss market trends, and learn from the community',
      members: '8,000+',
      color: 'text-[#FF4500]',
      bgColor: 'bg-[#FF4500]/10',
      link: 'https://reddit.com/r/quanttradeai'
    }
  ];

  const activities = [
    {
      icon: MessageCircle,
      title: 'Daily Discussions',
      description: 'Share trading ideas and market analysis with fellow traders'
    },
    {
      icon: Zap,
      title: 'Trading Competitions',
      description: 'Compete for prizes in monthly trading challenges'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Track top performers and earn community recognition'
    },
    {
      icon: Users,
      title: 'AMAs & Events',
      description: 'Regular Q&A sessions with the team and special guests'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Users className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join Our Community
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Connect with thousands of traders, share strategies, and grow together
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 space-y-16">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">78K+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Active Support</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Daily Discussions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">$1M+</div>
                <div className="text-sm text-muted-foreground">Competition Prizes</div>
              </CardContent>
            </Card>
          </div>

          {/* Social Platforms */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Connect With Us</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose your preferred platform and become part of our growing community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {platforms.map((platform, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`h-14 w-14 rounded-lg ${platform.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <platform.icon className={`h-7 w-7 ${platform.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{platform.name}</CardTitle>
                        <div className="text-sm text-muted-foreground mb-3">
                          {platform.members} members
                        </div>
                        <CardDescription>{platform.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-6 w-full"
                    >
                      Join on {platform.name}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Activities */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Community Activities</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Engage, learn, and earn rewards through various community programs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity, idx) => (
                <Card key={idx} className="text-center">
                  <CardHeader>
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <activity.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Community Guidelines</CardTitle>
                <CardDescription>
                  We foster a positive, respectful, and helpful environment for all members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Be Respectful:</strong> Treat all community members with respect and courtesy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Share Knowledge:</strong> Help others learn and grow in their trading journey
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">No Spam:</strong> Avoid excessive self-promotion or irrelevant content
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Stay On Topic:</strong> Keep discussions relevant to trading and QuantTrade AI
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">No Financial Advice:</strong> Share ideas but don't provide personalized financial advice
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-3xl font-bold">Ready to Join?</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Start connecting with traders from around the world and take your trading to the next level
                </p>
                <div>
                  <a href="https://discord.gg/quanttradeai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 h-11 px-8 text-lg">
                    Join Our Discord
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
