import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { History, Vote, BarChart3, Trash2, Info } from 'lucide-react';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { Tot } from '~backend/tots/types';
import { useSessionTracking } from '../hooks/useSessionTracking';

interface VoteHistoryItem {
  totId: string;
  option: 'A' | 'B' | 'C';
  timestamp: number;
  tot?: Tot;
}

export default function HistoryPage() {
  const [voteHistory, setVoteHistory] = useState<VoteHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getVoteHistory, clearSession } = useSessionTracking();

  useEffect(() => {
    const loadVoteHistory = async () => {
      const history = getVoteHistory();
      
      // Load tot details for each vote
      const historyWithTots = await Promise.all(
        history.map(async (vote) => {
          try {
            const tot = await backend.tots.get({ id: vote.totId });
            return { ...vote, tot };
          } catch (error) {
            // Tot might be deleted or private
            return vote;
          }
        })
      );

      setVoteHistory(historyWithTots);
      setIsLoading(false);
    };

    loadVoteHistory();
  }, [getVoteHistory]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your voting history? This action cannot be undone.')) {
      clearSession();
      setVoteHistory([]);
      toast.success('Voting history cleared');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOptionText = (vote: VoteHistoryItem) => {
    if (!vote.tot) return `Option ${vote.option}`;
    
    switch (vote.option) {
      case 'A': return vote.tot.optionAText;
      case 'B': return vote.tot.optionBText;
      case 'C': return vote.tot.optionCText || `Option ${vote.option}`;
      default: return `Option ${vote.option}`;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
            <History className="h-8 w-8" />
            <span>Your Voting History</span>
          </h1>
          <p className="text-muted-foreground">
            Track all the tots you've voted on and revisit the results
          </p>
        </div>
        
        {voteHistory.length > 0 && (
          <Button variant="outline" onClick={handleClearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        )}
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your voting history is stored locally in your browser. It will be lost if you clear your browser data or use a different device.
        </AlertDescription>
      </Alert>

      {voteHistory.length === 0 ? (
        <div className="text-center py-12">
          <Vote className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No votes yet</h3>
          <p className="text-muted-foreground mb-6">
            Start voting on tots to see your history here
          </p>
          <Link to="/browse">
            <Button>Browse Tots</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {voteHistory.map((vote, index) => (
            <Card key={`${vote.totId}-${vote.timestamp}`} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {vote.tot ? vote.tot.title : 'Tot Unavailable'}
                    </CardTitle>
                    <CardDescription>
                      Voted {formatDate(vote.timestamp)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    <Vote className="h-3 w-3 mr-1" />
                    Option {vote.option}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vote.tot && vote.tot.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {vote.tot.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Your choice:</span>{' '}
                      <span className="text-muted-foreground">{getOptionText(vote)}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {vote.tot ? (
                        <>
                          <Link to={`/tot/${vote.totId}`}>
                            <Button variant="outline" size="sm">
                              View Tot
                            </Button>
                          </Link>
                          <Link to={`/results/${vote.totId}`}>
                            <Button size="sm">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Results
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Badge variant="secondary">Tot Unavailable</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
