import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';
import { Vote, Plus, TrendingUp, History, Search, Menu, X } from 'lucide-react';
import { useSessionTracking } from '../hooks/useSessionTracking';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { getVoteHistory } = useSessionTracking();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const voteCount = getVoteHistory().length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ValidToT</span>
            </Link>
            
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
              <Input
                type="text"
                placeholder="Search tots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Tots
              </Link>
              <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-4 w-4" />
              </Link>
              <Link to="/history" className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
                <History className="h-4 w-4" />
                <span>History</span>
                {voteCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                    {voteCount}
                  </span>
                )}
              </Link>
              <Link to="/create">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search tots..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/browse" 
                    className="text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Browse Tots
                  </Link>
                  <Link 
                    to="/search" 
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Link>
                  <Link 
                    to="/history" 
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <History className="h-4 w-4" />
                    <span>History</span>
                    {voteCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                        {voteCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/create" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Tot
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 ValidToT. Visual This or That Voting Platform.</p>
        </div>
      </footer>
    </div>
  );
}
