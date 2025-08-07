import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { Tot } from '~backend/tots/types';

export default function TotPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tot, setTot] = useState<Tot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadTot = async () => {
      try {
        const totData = await backend.tots.get({ id });
        setTot(totData);
      } catch (error) {
        console.error('Failed to load poll:', error);
        toast.error('Failed to load poll');
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };

    loadTot();
  }, [id, navigate]);

  const handleVote = async (option: 'A' | 'B' | 'C') => {
    if (!id || !tot) return;

    setIsVoting(true);
    try {
      await backend.tots.vote({ id, option });
      toast.success('Vote submitted successfully!');
      navigate(`/results/${id}`);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      toast.error('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
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

  if (!tot) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Poll not found</p>
        <Link to="/browse">
          <Button>Browse Other Polls</Button>
        </Link>
      </div>
    );
  }

  const hasThreeOptions = tot.optionCText && tot.optionCText.trim();
  const gridCols = hasThreeOptions ? 'md:grid-cols-3' : 'md:grid-cols-2';

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
            <span>{tot.totalVotes} votes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{tot.expiresAt ? getTimeRemaining(tot.expiresAt) : 'No expiry'}</span>
          </div>
        </div>
      </div>

      {/* Voting Options */}
      <div className={`grid ${gridCols} gap-6`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-center">Option A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tot.optionAImageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={tot.optionAImageUrl}
                  alt={tot.optionAText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-medium mb-4">{tot.optionAText}</p>
              <Button
                onClick={() => handleVote('A')}
                disabled={isVoting}
                className="w-full"
                size="lg"
              >
                {isVoting ? 'Voting...' : 'Vote for A'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-center">Option B</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tot.optionBImageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={tot.optionBImageUrl}
                  alt={tot.optionBText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-medium mb-4">{tot.optionBText}</p>
              <Button
                onClick={() => handleVote('B')}
                disabled={isVoting}
                className="w-full"
                size="lg"
              >
                {isVoting ? 'Voting...' : 'Vote for B'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasThreeOptions && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-center">Option C</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tot.optionCImageUrl && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={tot.optionCImageUrl}
                    alt={tot.optionCText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="text-center">
                <p className="text-lg font-medium mb-4">{tot.optionCText}</p>
                <Button
                  onClick={() => handleVote('C')}
                  disabled={isVoting}
                  className="w-full"
                  size="lg"
                >
                  {isVoting ? 'Voting...' : 'Vote for C'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Results Link */}
      <div className="text-center">
        <Link to={`/results/${tot.id}`}>
          <Button variant="outline" size="lg">
            <BarChart3 className="h-5 w-5 mr-2" />
            View Current Results
          </Button>
        </Link>
      </div>
    </div>
  );
}
