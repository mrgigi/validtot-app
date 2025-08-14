import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from 'sonner';
import backend from '~backend/client';
import type { CreateTotRequest } from '~backend/tots/types';
import { useSessionTracking } from '../hooks/useSessionTracking';

export default function CreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { recordCreation } = useSessionTracking();
  const [formData, setFormData] = useState<CreateTotRequest>({
    title: '',
    description: '',
    optionAText: '',
    optionAImageUrl: '',
    optionBText: '',
    optionBImageUrl: '',
    optionCText: '',
    optionCImageUrl: '',
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (formData.title.length > 120) {
      toast.error('Title must be 120 characters or less');
      return;
    }

    if (formData.description && formData.description.length > 250) {
      toast.error('Description must be 250 characters or less');
      return;
    }

    if (!formData.optionAText.trim() || !formData.optionBText.trim()) {
      toast.error('Please enter both options A and B');
      return;
    }

    if (formData.optionAText.length > 100 || formData.optionBText.length > 100) {
      toast.error('Option text must be 100 characters or less');
      return;
    }

    if (formData.optionCText && formData.optionCText.length > 100) {
      toast.error('Option text must be 100 characters or less');
      return;
    }

    setIsLoading(true);

    try {
      const tot = await backend.tots.create(formData);
      recordCreation(tot.id);
      toast.success('Tot created successfully!');
      navigate(`/tot/${tot.id}`);
    } catch (error) {
      console.error('Failed to create tot:', error);
      toast.error('Failed to create tot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setExpiry = (hours: string) => {
    if (hours === 'never') {
      setFormData({ ...formData, expiresAt: undefined });
    } else {
      const expiryDate = new Date(Date.now() + parseInt(hours) * 60 * 60 * 1000);
      setFormData({ ...formData, expiresAt: expiryDate });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a New Tot</h1>
        <p className="text-muted-foreground">
          Got Pictures? Let the crowd decide in minutes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tot Details</CardTitle>
          <CardDescription>
            Fill in the details for your new tot. Add up to 3 options with images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title">Title * (max 120 characters)</Label>
              <Input
                id="title"
                placeholder="What's your tot about?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={120}
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.title.length}/120
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional, max 250 characters)</Label>
              <Textarea
                id="description"
                placeholder="Add more context to your tot..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                maxLength={250}
              />
              <div className="text-xs text-muted-foreground text-right">
                {(formData.description || '').length}/250
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Time</Label>
              <Select onValueChange={setExpiry} defaultValue="24">
                <SelectTrigger>
                  <SelectValue placeholder="Select expiry time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours (default)</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                  <SelectItem value="never">Never expires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {/* Option A */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Option A *</h3>
                <div className="space-y-2">
                  <Label htmlFor="optionAText">Text * (max 24 characters)</Label>
                  <Input
                    id="optionAText"
                    placeholder="First option"
                    value={formData.optionAText}
                    onChange={(e) => setFormData({ ...formData, optionAText: e.target.value })}
                    required
                    maxLength={24}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.optionAText.length}/24
                  </div>
                </div>
                <ImageUpload
                  label="Image (Optional)"
                  placeholder="https://example.com/image.jpg"
                  value={formData.optionAImageUrl}
                  onChange={(url) => setFormData({ ...formData, optionAImageUrl: url })}
                  onRemove={() => setFormData({ ...formData, optionAImageUrl: '' })}
                />
              </div>

              {/* Option B */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Option B *</h3>
                <div className="space-y-2">
                  <Label htmlFor="optionBText">Text * (max 24 characters)</Label>
                  <Input
                    id="optionBText"
                    placeholder="Second option"
                    value={formData.optionBText}
                    onChange={(e) => setFormData({ ...formData, optionBText: e.target.value })}
                    required
                    maxLength={24}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.optionBText.length}/24
                  </div>
                </div>
                <ImageUpload
                  label="Image (Optional)"
                  placeholder="https://example.com/image.jpg"
                  value={formData.optionBImageUrl}
                  onChange={(url) => setFormData({ ...formData, optionBImageUrl: url })}
                  onRemove={() => setFormData({ ...formData, optionBImageUrl: '' })}
                />
              </div>

              {/* Option C */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Option C (Optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="optionCText">Text (max 24 characters)</Label>
                  <Input
                    id="optionCText"
                    placeholder="Third option"
                    value={formData.optionCText}
                    onChange={(e) => setFormData({ ...formData, optionCText: e.target.value })}
                    maxLength={24}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {(formData.optionCText || '').length}/24
                  </div>
                </div>
                <ImageUpload
                  label="Image (Optional)"
                  placeholder="https://example.com/image.jpg"
                  value={formData.optionCImageUrl}
                  onChange={(url) => setFormData({ ...formData, optionCImageUrl: url })}
                  onRemove={() => setFormData({ ...formData, optionCImageUrl: '' })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label htmlFor="isPublic">Make this tot public</Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? 'Creating...' : 'Create Tot'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}