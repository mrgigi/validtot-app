import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Users, Clock, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { Tot } from '~backend/tots/types';
import { useSessionTracking } from '../hooks/useSessionTracking';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tots, setTots] = useState<Tot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { hasVotedOn, hasCreated } = useSessionTracking();

  const performSearch = async (query: string, pageNum: number = 1) => {
    if (!query.trim()) {
      setTots([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.tots.search({
        q: query,
        page: pageNum,
        limit: 12
      });
      
      if (pageNum === 1) {
        setTots(response.tots);
      } else {
        setTots(prev => [...prev, ...response.tots]);
      }
      
      setHasMore(response.tots.length === 12);
    } catch (error) {
      console.error('Failed to search tots:', error);
      toast.error('Failed to search tots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchParams({ q: searchQuery });
    setPage(1);
    performSearch(searchQuery, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(searchQuery, nextPage);
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
        <h1 className="text-3xl font-bold mb-2">Search Tots</h1>
        <p className="text-muted-foreground">
          Find tots by title or description
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search for tots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {searchQuery && (
        <div className="text-center text-muted-foreground">
          {isLoading ? 'Searching...' : `Results for "${searchQuery}"`}
        </div>
      )}

      {isLoading && tots.length === 0 ? (
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
      ) : tots.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No tots found for "{searchQuery}"
          </p>
          <Link to="/browse">
            <Button>Browse All Tots</Button>
          </Link>
        </div>
      ) : tots.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tots.map((tot) => {
              const hasVoted = hasVotedOn(tot.id);
              const isCreator = hasCreated(tot.id);
              
              return (
                <Card key={tot.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{tot.title}</CardTitle>
                      <div className="flex flex-col space-y-1 ml-2">
                        {tot.isTrending && (
                          <Badge variant="secondary">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {hasVoted && (
                          <Badge variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Voted
                          </Badge>
                        )}
                        {isCreator && (
                          <Badge variant="outline">
                            <User className="h-3 w-3 mr-1" />
                            Your Tot
                          </Badge>
                        )}
                      </div>
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

                      <div className="flex space-x-2">
                        <Link to={`/tot/${tot.id}`} className="flex-1">
                          <Button className="w-full" variant={hasVoted || isCreator ? "outline" : "default"}>
                            {hasVoted ? 'View & Results' : isCreator ? 'View Your Tot' : 'Vote Now'}
                          </Button>
                        </Link>
                        {(hasVoted || isCreator) && (
                          <Link to={`/results/${tot.id}`}>
                            <Button variant="outline" size="icon">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
