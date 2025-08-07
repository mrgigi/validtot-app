import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrendingUp, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { Tot } from '~backend/tots/types';

export default function BrowsePage() {
  const [tots, setTots] = useState<Tot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrending, setShowTrending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadTots = async (pageNum: number = 1, trending: boolean = false) => {
    try {
      const response = await backend.tots.listPublic({
        page: pageNum,
        limit: 12,
        trending
      });
      
      if (pageNum === 1) {
        setTots(response.tots);
      } else {
        setTots(prev => [...prev, ...response.tots]);
      }
      
      setHasMore(response.tots.length === 12);
    } catch (error) {
      console.error('Failed to load tots:', error);
      toast.error('Failed to load tots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    loadTots(1, showTrending);
  }, [showTrending]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTots(nextPage, showTrending);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d remaining`;
    }
    if (hours > 0) {
      return `${hours}h remaining`;
    }
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m remaining`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Browse Tots</h1>
        <p className="text-muted-foreground">
          Discover and vote on interesting tots from the community
        </p>
      </div>

      <div className="flex items-center space-x-2 justify-center">
        <Switch
          id="trending"
          checked={showTrending}
          onCheckedChange={setShowTrending}
        />
        <Label htmlFor="trending" className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Show trending only</span>
        </Label>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {showTrending ? 'No trending tots found' : 'No tots found'}
          </p>
          <Link to="/create">
            <Button>Create the first tot</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tots.map((tot) => (
              <Card key={tot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{tot.title}</CardTitle>
                    {tot.isTrending && (
                      <Badge variant="secondary" className="ml-2">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  {tot.description && (
                    <CardDescription className="line-clamp-2">
                      {tot.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{tot.totalVotes} votes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{tot.expiresAt ? getTimeRemaining(tot.expiresAt) : formatDate(tot.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Options:</div>
                      <div className="text-sm text-muted-foreground">
                        <div>A: {tot.optionAText}</div>
                        <div>B: {tot.optionBText}</div>
                        {tot.optionCText && <div>C: {tot.optionCText}</div>}
                      </div>
                    </div>

                    <Link to={`/tot/${tot.id}`} className="block">
                      <Button className="w-full">Vote Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button variant="outline" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
