import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Vote, Plus, TrendingUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ValidToT</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Tots
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
          </div>
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
