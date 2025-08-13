import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Clock, TrendingUp, BarChart3, CheckCircle, Info, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { Tot } from '~backend/tots/types';
import { useSessionTracking } from '../hooks/useSessionTracking';

export default function TotPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tot, setTot] = useState<Tot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const { hasVotedOn, getVoteFor, recordVote, hasCreated } = useSessionTracking();

  const hasAlreadyVoted = id ? hasVotedOn(id) : false;
  const previousVote = id ? getVoteFor(id) : null;
  const isCreator = id ? hasCreated(id) : false;

  useEffect(() => {
    if (!id) return;

    const loadTot = async () => {
      try {
        const totData = await backend.tots.get({ id });
        setTot(totData);
      } catch (error) {
        console.error('Failed to load tot:', error);
        toast.error('Failed to load tot');
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };

    loadTot();
  }, [id, navigate]);

  const handleVote = async (option: 'A' | 'B' | 'C') => {
    if (!id || !tot) return;

    if (hasAlreadyVoted) {
      toast.error('You have already voted on this tot');
      return;
    }

    setIsVoting(true);
    try {
      await backend.tots.vote({ id, option });
      recordVote(id, option);
      toast.success('Vote submitted successfully!');
      navigate(`/results/${id}`);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      toast.error('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = async () => {
    if (!tot) return;
    const url = `${window.location.origin}/tot/${tot.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tot.title || 'Check out this tot',
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

  const getOptionLabel = (option: 'A' | 'B' | 'C') => {
    switch (option) {
      case 'A': return tot?.optionAText || 'Option A';
      case 'B': return tot?.optionBText || 'Option B';
      case 'C': return tot?.optionCText || 'Option C';
    }
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
        <p className="text-muted-foreground mb-4">Tot not found</p>
        <Link to="/browse">
          <Button>Browse Other Tots</Button>
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
          {isCreator && (
            <Badge variant="outline">
              Your Tot
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

      {/* Vote Status Alert */}
      {hasAlreadyVoted && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            You have already voted for <strong>{getOptionLabel(previousVote!)}</strong> on this tot.
            <Link to={`/results/${tot.id}`} className="ml-2 underline">
              View results
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {isCreator && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is your tot! You can view the results but cannot vote on your own creation.
          </AlertDescription>
        </Alert>
      )}

      {/* Voting Options */}
      <div className={`grid ${gridCols} gap-6`}>
        <Card className={`hover:shadow-lg transition-shadow cursor-pointer group ${
          previousVote === 'A' ? 'ring-2 ring-primary' : ''
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-center">Option A</CardTitle>
              {previousVote === 'A' && (
                <Badge variant="default">Your Vote</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tot.optionAImageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={tot.optionAImageUrl}
                  alt={tot.optionAText}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-medium mb-4">{tot.optionAText}</p>
              <Button
                onClick={() => handleVote('A')}
                disabled={isVoting || hasAlreadyVoted || isCreator}
                className="w-full"
                size="lg"
                variant={previousVote === 'A' ? 'default' : 'outline'}
              >
                {isVoting ? 'Voting...' :
                 hasAlreadyVoted ? (previousVote === 'A' ? 'Your Vote' : 'Already Voted') :
                 isCreator ? 'Cannot Vote (Your Tot)' :
                 'Vote for A'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-lg transition-shadow cursor-pointer group ${
          previousVote === 'B' ? 'ring-2 ring-primary' : ''
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-center">Option B</CardTitle>
              {previousVote === 'B' && (
                <Badge variant="default">Your Vote</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tot.optionBImageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={tot.optionBImageUrl}
                  alt={tot.optionBText}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-medium mb-4">{tot.optionBText}</p>
              <Button
                onClick={() => handleVote('B')}
                disabled={isVoting || hasAlreadyVoted || isCreator}
                className="w-full"
                size="lg"
                variant={previousVote === 'B' ? 'default' : 'outline'}
              >
                {isVoting ? 'Voting...' :
                 hasAlreadyVoted ? (previousVote === 'B' ? 'Your Vote' : 'Already Voted') :
                 isCreator ? 'Cannot Vote (Your Tot)' :
                 'Vote for B'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasThreeOptions && (
          <Card className={`hover:shadow-lg transition-shadow cursor-pointer group ${
            previousVote === 'C' ? 'ring-2 ring-primary' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-center">Option C</CardTitle>
                {previousVote === 'C' && (
                  <Badge variant="default">Your Vote</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tot.optionCImageUrl && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={tot.optionCImageUrl}
                    alt={tot.optionCText}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="text-center">
                <p className="text-lg font-medium mb-4">{tot.optionCText}</p>
                <Button
                  onClick={() => handleVote('C')}
                  disabled={isVoting || hasAlreadyVoted || isCreator}
                  className="w-full"
                  size="lg"
                  variant={previousVote === 'C' ? 'default' : 'outline'}
                >
                  {isVoting ? 'Voting...' :
                   hasAlreadyVoted ? (previousVote === 'C' ? 'Your Vote' : 'Already Voted') :
                   isCreator ? 'Cannot Vote (Your Tot)' :
                   'Vote for C'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons: Share and View Results */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Button variant="outline" size="lg" onClick={handleShare} className="w-full sm:w-auto">
          <Share2 className="h-5 w-5 mr-2" />
          Share Tot
        </Button>
        <Link to={`/results/${tot.id}`}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <BarChart3 className="h-5 w-5 mr-2" />
            View Current Results
          </Button>
        </Link>
      </div>
    </div>
  );
}