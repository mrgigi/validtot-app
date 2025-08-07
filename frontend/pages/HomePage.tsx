import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Users, Zap, Camera, Share2, BarChart3, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Compare Anything. Instantly.
          <span className="text-primary block">No Follows. No Sign-Ups.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create visual polls in seconds. Get instant feedback from the crowd. 
          Perfect for choosing outfits, comparing options, or settling debates.
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

      {/* Example Demo Section */}
      <section className="bg-muted/50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
          <p className="text-muted-foreground">Here's how a typical poll looks</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CardTitle className="text-2xl">Which outfit looks better?</CardTitle>
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </div>
              <CardDescription>Help me choose for tonight's dinner!</CardDescription>
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mt-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>1,247 votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>23h remaining</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">Casual & Comfy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center text-blue-600">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Casual Outfit Photo</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button className="w-full" size="lg">
                    Vote for Casual
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">Dressed Up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <div className="text-center text-purple-600">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Formal Outfit Photo</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button className="w-full" size="lg">
                    Vote for Formal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link to="/create">
              <Button size="lg">
                Create Your Own Poll Like This
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get instant feedback in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Step 1: Take Pics</CardTitle>
              <CardDescription>
                Take pics of up to 3 options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Whether it's 2 hats, 3 selfie filters, outfits, memes or quotes, 
                or any idea you want instant feedback on.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Step 2: Let the Crowd Decide</CardTitle>
              <CardDescription>
                Share and get votes instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No friends needed — or invite them with a share link. 
                The community will help you decide.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Step 3: Get Real-time Results</CardTitle>
              <CardDescription>
                Watch the votes come in live
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Polls last 24 hours. Stay anonymous or go viral — your choice. 
                See instant percentages and vote counts.
              </p>
            </CardContent>
          </Card>
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
