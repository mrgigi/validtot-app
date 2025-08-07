import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Visual This or That
          <span className="text-primary block">Voting Platform</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create engaging visual polls, share with your audience, and discover what people really prefer. 
          Make decisions fun with ValidToT.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Poll
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <TrendingUp className="h-5 w-5 mr-2" />
              Browse Trending
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <Zap className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Quick & Easy</CardTitle>
            <CardDescription>
              Create visual polls in seconds with our intuitive interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload images, add descriptions, and share your poll instantly. 
              No registration required.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Real-time Results</CardTitle>
            <CardDescription>
              Watch votes come in live with beautiful visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See percentage breakdowns, vote counts, and trending status 
              updated in real-time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Discover Trends</CardTitle>
            <CardDescription>
              Explore what's popular and join the conversation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse trending polls, discover new perspectives, and see 
              what the community is talking about.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-muted rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Join thousands of users creating engaging visual polls. 
          It's free, fast, and fun!
        </p>
        <Link to="/create">
          <Button size="lg">
            Create Your Poll Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
