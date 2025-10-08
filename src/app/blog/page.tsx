'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: 'Introducing QuantTrade AI: The Future of Crypto Trading',
      excerpt: 'Discover how our Multi-LLM Neural Network is revolutionizing automated cryptocurrency trading with cutting-edge AI technology.',
      date: '2025-10-01',
      readTime: '5 min read',
      category: 'Product Updates',
      featured: true
    },
    {
      title: 'Understanding AI-Powered Trading Strategies',
      excerpt: 'Learn how artificial intelligence analyzes market data, identifies patterns, and executes profitable trades 24/7.',
      date: '2025-09-28',
      readTime: '8 min read',
      category: 'Education',
      featured: false
    },
    {
      title: 'Maximizing Your Spin to Win Rewards',
      excerpt: 'Tips and strategies to earn more free spins and increase your chances of winning big prizes.',
      date: '2025-09-25',
      readTime: '4 min read',
      category: 'Guides',
      featured: false
    },
    {
      title: 'Smart Contract Security: What You Need to Know',
      excerpt: 'An in-depth look at how we protect your assets with audited smart contracts and enterprise-grade security.',
      date: '2025-09-20',
      readTime: '6 min read',
      category: 'Security',
      featured: false
    },
    {
      title: 'The Rise of Automated Crypto Trading',
      excerpt: 'Market trends show increasing adoption of AI-powered trading platforms. Here\'s why institutional investors are taking notice.',
      date: '2025-09-15',
      readTime: '7 min read',
      category: 'Market Analysis',
      featured: false
    },
    {
      title: 'Portfolio Diversification in Volatile Markets',
      excerpt: 'Expert strategies for maintaining a balanced crypto portfolio during market uncertainty.',
      date: '2025-09-10',
      readTime: '6 min read',
      category: 'Education',
      featured: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights, updates, and educational content from the QuantTrade AI team
            </p>
          </div>

          {/* Featured Post */}
          {posts.filter(p => p.featured).map((post, idx) => (
            <Card key={idx} className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-600">Featured</Badge>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardTitle className="text-3xl mb-2">{post.title}</CardTitle>
                <CardDescription className="text-lg">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                <div className="mt-4">
                  <a href="#" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold">
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.filter(p => !p.featured).map((post, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <a href="#" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter CTA */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Stay Updated</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest updates, trading insights, and exclusive content.
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
