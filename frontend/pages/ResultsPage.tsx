import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, TrendingUp, Vote, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { TotResults } from '~backend/tots/types';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<TotResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadResults = async () => {
      try {
        const resultsData = await backend.tots.getResults({ id });
        setResults(resultsData);
      } catch (error) {
        console.error('Failed to load results:', error);
        toast.error('Failed to load results');
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href.replace('/results/', '/tot/');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: results?.tot.title || 'Check out this tot',
          text: 'Vote on this interesting tot!',
          url: url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Tot link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Results not found</p>
        <Link to="/browse">
          <Button>Browse Other Tots</Button>
        </Link>
      </div>
    );
  }

  const { tot, percentageA, percentageB, percentageC } = results;
  const hasThreeOptions = tot.optionCText && tot.optionCText.trim();
  const gridCols = hasThreeOptions ? 'md:grid-cols-3' : 'md:grid-cols-2';

  // Determine winner
  const maxPercentage = Math.max(percentageA, percentageB, percentageC);
  const isAWinner = percentageA === maxPercentage;
  const isBWinner = percentageB === maxPercentage;
  const isCWinner = percentageC === maxPercentage && hasThreeOptions;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-3xl font-bold">{tot.title}</h1>
          {tot.isTrending && (
            <Badge variant="secondary">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        
        {tot.description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {tot.description}
          </p>
        )}

        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{tot.totalVotes} total votes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{tot.expiresAt ? getTimeRemaining(tot.expiresAt) : 'No expiry'}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={`grid ${gridCols} gap-6`}>
        <Card className={`${isAWinner ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-center">Option A</CardTitle>
              {isAWinner && (
                <Badge variant="default">Winner</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tot.optionAImageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={tot.optionAImageUrl}
                  alt={tot.optionAText}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="text-center space-y-4">
              <p className="text-lg font-medium">{tot.optionAText}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{percentageA}%</span>
                  <span>{tot.optionAVotes} votes</span>
                </div>
                <Progress value={percentageA} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${isBWinner ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-center">Option B</CardTitle>
              {isBWinner && (
                <Badge variant="default">Winner</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tot.optionBImageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={tot.optionBImageUrl}
                  alt={tot.optionBText}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="text-center space-y-4">
              <p className="text-lg font-medium">{tot.optionBText}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{percentageB}%</span>
                  <span>{tot.optionBVotes} votes</span>
                </div>
                <Progress value={percentageB} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {hasThreeOptions && (
          <Card className={`${isCWinner ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-center">Option C</CardTitle>
                {isCWinner && (
                  <Badge variant="default">Winner</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tot.optionCImageUrl && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={tot.optionCImageUrl}
                    alt={tot.optionCText}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="text-center space-y-4">
                <p className="text-lg font-medium">{tot.optionCText}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{percentageC}%</span>
                    <span>{tot.optionCVotes} votes</span>
                  </div>
                  <Progress value={percentageC} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={`/tot/${tot.id}`}>
          <Button size="lg" className="w-full sm:w-auto">
            <Vote className="h-5 w-5 mr-2" />
            Vote on This Tot
          </Button>
        </Link>
        <Button variant="outline" size="lg" onClick={handleShare} className="w-full sm:w-auto">
          <Share2 className="h-5 w-5 mr-2" />
          Share Tot
        </Button>
        <Link to="/browse">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Browse More Tots
          </Button>
        </Link>
      </div>
    </div>
  );
}
