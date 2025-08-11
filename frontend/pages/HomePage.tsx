import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Users, Zap, Camera, Share2, BarChart3, Clock, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const exampleTots = [
  {
    id: 1,
    title: "Need a new DP ASAP. Which?",
    description: "Help me choose the best display picture!",
    votes: 847523,
    timeRemaining: "23h remaining",
    options: [
      {
        title: "DP Option 1",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 356000,
        percentage: 42
      },
      {
        title: "DP Option 2",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 491523,
        percentage: 58
      }
    ]
  },
  {
    id: 2,
    title: "Geek Glasses or NA!?",
    description: "Honest opinions please! 🤓",
    votes: 2909000,
    timeRemaining: "18h remaining",
    options: [
      {
        title: "With Glasses",
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/withglasses.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC93aXRoZ2xhc3Nlcy5wbmciLCJpYXQiOjE3NTQ1ODM5NDksImV4cCI6MTc4NjExOTk0OX0.8GwsZWHtlTLyJDBm7vJBiF-WyZVAHhIBYSMGUajWYc8",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 2100000,
        percentage: 72
      },
      {
        title: "Without Glasses",
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/Without%20glasses.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC9XaXRob3V0IGdsYXNzZXMucG5nIiwiaWF0IjoxNzU0NTg0Mzg3LCJleHAiOjE3ODYxMjAzODd9.cjC3gOK_jhWx1YHybJn1r0fiWousNvOdJAt0x4mXhNM",
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
    title: "Which should I choose for my big day?",
    description: "Help me pick the perfect dress for my dream wedding! 👰✨",
    votes: 1256420,
    timeRemaining: "11h remaining",
    options: [
      {
        title: "Classic Elegance",
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/Wedding%20Dress%202.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC9XZWRkaW5nIERyZXNzIDIucG5nIiwiaWF0IjoxNzU0NTgzODU0LCJleHAiOjE3ODYxMTk4NTR9.MCCWx6FSdDLbKyjr3Hc8CRY3AaedTMiGCAJDsc0j-Nc",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 753852,
        percentage: 60
      },
      {
        title: "Modern Romance",
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/Wedding%20Dress%201.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC9XZWRkaW5nIERyZXNzIDEucG5nIiwiaWF0IjoxNzU0NTgzODg4LCJleHAiOjE3ODYxMTk4ODh9.Pq7coAvwWxbkFhw3IafWhZJmtFN5Z5GJYvUsIRn-KN8",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 502568,
        percentage: 40
      }
    ]
  }
];

export default function HomePage() {
  const [currentTotIndex, setCurrentTotIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const formatVotes = (votes: number) => {
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}m`;
    }
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}k`;
    }
    return votes.toString();
  };

  const nextTot = () => {
    setCurrentTotIndex((prev) => (prev + 1) % exampleTots.length);
  };

  const prevTot = () => {
    setCurrentTotIndex((prev) => (prev - 1 + exampleTots.length) % exampleTots.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40; // minimal swipe distance
    if (deltaX > threshold) {
      prevTot();
    } else if (deltaX < -threshold) {
      nextTot();
    }
    touchStartX.current = null;
  };

  const currentTot = exampleTots[currentTotIndex];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Compare Anything. Instantly.
          <span className="text-primary block">No Follows. No Sign-Ups.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create visual tots in seconds. Get instant feedback from the crowd. 
          Perfect for choosing outfits, comparing options, or settling debates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Tot
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
          <p className="text-muted-foreground">Here's how typical tots look</p>
        </div>
        
        <div
          className="max-w-4xl mx-auto relative"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={prevTot}
            aria-label="Previous sample"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={nextTot}
            aria-label="Next sample"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Tot Card */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CardTitle className="text-2xl">{currentTot.title}</CardTitle>
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </div>
              <CardDescription>{currentTot.description}</CardDescription>
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mt-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{formatVotes(currentTot.votes)} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{currentTot.timeRemaining}</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {currentTot.options.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className={`bg-gradient-to-br ${option.color} flex items-center justify-center h-full`}>
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
            {exampleTots.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTotIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentTotIndex(index)}
                aria-label={`Go to sample ${index + 1}`}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/create">
              <Button size="lg">
                Create Your Own Tot Like This
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
                Tots last 24 hours. Stay anonymous or go viral — your choice. 
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
              Create visual tots in seconds with our intuitive interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload images, add descriptions, and share your tot instantly. 
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
              Browse trending tots, discover new perspectives, and see 
              what the community is talking about.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-muted rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Join thousands of users creating engaging visual tots. 
          It's free, fast, and fun!
        </p>
        <Link to="/create">
          <Button size="lg">
            Create Your Tot Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
