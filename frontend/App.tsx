import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import TotPage from './pages/TotPage';
import ResultsPage from './pages/ResultsPage';
import BrowsePage from './pages/BrowsePage';
import HistoryPage from './pages/HistoryPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="validtot-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/tot/:id" element={<TotPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}
