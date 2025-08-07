import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { CreateTotRequest } from '~backend/tots/types';

export default function CreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTotRequest>({
    title: '',
    description: '',
    optionAText: '',
    optionAImageUrl: '',
    optionBText: '',
    optionBImageUrl: '',
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.optionAText.trim() || !formData.optionBText.trim()) {
      toast.error('Please enter both options');
      return;
    }

    setIsLoading(true);

    try {
      const tot = await backend.tots.create(formData);
      toast.success('Poll created successfully!');
      navigate(`/tot/${tot.id}`);
    } catch (error) {
      console.error('Failed to create poll:', error);
      toast.error('Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a New Poll</h1>
        <p className="text-muted-foreground">
          Create an engaging visual "This or That" poll to share with others
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>
            Fill in the details for your new poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What's your poll about?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more context to your poll..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Option A</h3>
                <div className="space-y-2">
                  <Label htmlFor="optionAText">Text *</Label>
                  <Input
                    id="optionAText"
                    placeholder="First option"
                    value={formData.optionAText}
                    onChange={(e) => setFormData({ ...formData, optionAText: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="optionAImage">Image URL (Optional)</Label>
                  <Input
                    id="optionAImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.optionAImageUrl}
                    onChange={(e) => setFormData({ ...formData, optionAImageUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Option B</h3>
                <div className="space-y-2">
                  <Label htmlFor="optionBText">Text *</Label>
                  <Input
                    id="optionBText"
                    placeholder="Second option"
                    value={formData.optionBText}
                    onChange={(e) => setFormData({ ...formData, optionBText: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="optionBImage">Image URL (Optional)</Label>
                  <Input
                    id="optionBImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.optionBImageUrl}
                    onChange={(e) => setFormData({ ...formData, optionBImageUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label htmlFor="isPublic">Make this poll public</Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Poll'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
