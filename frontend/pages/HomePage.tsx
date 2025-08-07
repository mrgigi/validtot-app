import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Users, Zap, Camera, Share2, BarChart3, Clock, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const examplePolls = [
  {
    id: 1,
    title: "Which outfit looks better?",
    description: "Help me choose for tonight's dinner!",
    votes: 1247,
    timeRemaining: "23h remaining",
    options: [
      {
        title: "Casual & Comfy",
        image: null,
        placeholder: "Casual Outfit Photo",
        color: "from-blue-100 to-blue-200",
        textColor: "text-blue-600",
        votes: 523,
        percentage: 42
      },
      {
        title: "Dressed Up",
        image: null,
        placeholder: "Formal Outfit Photo",
        color: "from-purple-100 to-purple-200",
        textColor: "text-purple-600",
        votes: 724,
        percentage: 58
      }
    ]
  },
  {
    id: 2,
    title: "Hey Friends. I'm better with or without the glasses?",
    description: "Honest opinions please! 🤓",
    votes: 2909000,
    timeRemaining: "18h remaining",
    options: [
      {
        title: "With Glasses",
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/Warm%20Smile%20in%20Soft%20Lighting.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC9XYXJtIFNtaWxlIGluIFNvZnQgTGlnaHRpbmcucG5nIiwiaWF0IjoxNzU0NTgyOTc5LCJleHAiOjE3ODYxMTg5Nzl9.Fepwgd8hLioHy7Avmyn-t_d8N16eITxhCDEga3vDfLY",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 2100000,
        percentage: 72
      },
      {
        title: "Without Glasses",
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/Wedding%20Dress%202.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC9XZWRkaW5nIERyZXNzIDIucG5nIiwiaWF0IjoxNzU0NTgzMDQ2LCJleHAiOjE3ODYxMTkwNDZ9.yzmyojviCs07vwhEXOmwFx9GzLVBubevr6iC1SKcrSg",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 809000,
        percentage: 28
      }
    ]
  },
  {
    id: 3,
    title: "Which coding setup is more productive?",
    description: "Settling the eternal debate once and for all!",
    votes: 5432,
    timeRemaining: "12h remaining",
    options: [
      {
        title: "Dark Mode",
        image: null,
        placeholder: "Dark Theme IDE",
        color: "from-gray-800 to-gray-900",
        textColor: "text-gray-100",
        votes: 4210,
        percentage: 77
      },
      {
        title: "Light Mode",
        image: null,
        placeholder: "Light Theme IDE",
        color: "from-gray-50 to-gray-100",
        textColor: "text-gray-800",
        votes: 1222,
        percentage: 23
      }
    ]
  }
];

export default function HomePage() {
  const [currentPollIndex, setCurrentPollIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPollIndex((prev) => (prev + 1) % examplePolls.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatVotes = (votes: number) => {
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}m`;
    }
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}k`;
    }
    return votes.toString();
  };

  const nextPoll = () => {
    setCurrentPollIndex((prev) => (prev + 1) % examplePolls.length);
  };

  const prevPoll = () => {
    setCurrentPollIndex((prev) => (prev - 1 + examplePolls.length) % examplePolls.length);
  };

  const currentPoll = examplePolls[currentPollIndex];

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
          <p className="text-muted-foreground">Here's how typical polls look</p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={prevPoll}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={nextPoll}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Poll Card */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CardTitle className="text-2xl">{currentPoll.title}</CardTitle>
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </div>
              <CardDescription>{currentPoll.description}</CardDescription>
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mt-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{formatVotes(currentPoll.votes)} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{currentPoll.timeRemaining}</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {currentPoll.options.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                        <div className={`text-center ${option.textColor}`}>
                          <Camera className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">{option.placeholder}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      <span>{formatVotes(option.votes)} loves</span>
                      <span>•</span>
                      <span>{option.percentage}%</span>
                    </div>
                    <Button className="w-full" size="lg">
                      Vote for {option.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {examplePolls.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPollIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentPollIndex(index)}
              />
            ))}
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
