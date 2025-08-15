import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/Profile%20Pic%201.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC9Qcm9maWxlIFBpYyAxLnBuZyIsImlhdCI6MTc1NDkyMzI3OCwiZXhwIjoxNzg2NDU5Mjc4fQ.3iPzmTfYBYahuKRfBu2aFmffTKoizqgIRWJDgtfYg4M",
        placeholder: null,
        color: null,
        textColor: null,
        votes: 356000,
        percentage: 42
      },
      {
        title: "DP Option 2",
        image: "https://pmccieeeafumffeudusl.supabase.co/storage/v1/object/sign/validtot/Profile%20Pic%202.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83Y2U3MTJlZS0wMzJiLTRkZTQtODI3MS1hOWIzODNiZTlkYzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWxpZHRvdC9Qcm9maWxlIFBpYyAyLnBuZyIsImlhdCI6MTc1NDkyMzcwMiwiZXhwIjoxNzg2NDU5NzAyfQ.y8sylBYoTo8yDPwZBxMiAlAf4Q-2s0woE7lY4fH5uv4",
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
          Want instant feedback on your pics? You’re in the right place — 
					perfect for outfit choices, side-by-side comparisons, and quick decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First ToT
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
          <p className="text-muted-foreground">Here's how typical ToTs look</p>
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
                Create Your Own ToT Like This
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

      {/* FAQs Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about ValidToT
          </p>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="faq-1">
            <AccordionTrigger>What is ValidToT and what’s a ToT?</AccordionTrigger>
            <AccordionContent>
              ValidToT is a space to get quick, anonymous feedback on everyday choices — from outfits to opinions — using “ToTs” (This or That polls). You upload two options, and the crowd picks. No pressure, no profiles, just clean, instant votes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>Why use ValidToT instead of asking friends or posting on social media?</AccordionTrigger>
            <AccordionContent>
              Sometimes you want unbiased input — not your friends’ opinions or social media pressure. ValidToT gives you honest crowd feedback without the noise of likes, followers, or judgment.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>Do I need to sign up or create an account?</AccordionTrigger>
            <AccordionContent>
              Nope. You can ask and vote on ToTs without creating an account. No names, no emails, no profiles. Just pure interaction — fast and anonymous.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4">
            <AccordionTrigger>Who sees my ToTs?</AccordionTrigger>
            <AccordionContent>
              Your ToTs are public to the ValidToT community — a mix of people who love giving feedback. But your identity is always private.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-5">
            <AccordionTrigger>What kind of questions can I ask on ValidToT?</AccordionTrigger>
            <AccordionContent>
              Anything that helps you decide between two options. Here are some examples from real-life use cases:
              <ul>
                <li>Fashion: “Black sneakers or white loafers for tonight?”</li>
                <li>Design: “Logo A or Logo B for my startup?”</li>
                <li>Food: “Sushi or tacos for dinner?”</li>
                <li>Shopping: “iPhone 15 or Galaxy S24?”</li>
                <li>Relationships: “Reply to the text or leave it on read?”</li>
              </ul>
              Whether it’s serious or just for laughs — if it’s a “this or that,” it belongs here.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-6">
            <AccordionTrigger>Is ValidToT free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, it’s 100% free to vote, post, and explore ToTs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-7">
            <AccordionTrigger>Will there be more features in the future?</AccordionTrigger>
            <AccordionContent>
              Absolutely. We’re experimenting with reactions, themed categories, saved ToTs, and more. But we’ll always keep it simple, honest, and anonymous at the core.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>


      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8"></section>

      {/* CTA Section */}
      <section className="text-center bg-muted rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Drop your pictures, get instant vibes from the people. 
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
