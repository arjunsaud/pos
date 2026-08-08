'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, MessageCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ContentManagement() {
  // Landing page form state
  const [heroTitle, setHeroTitle] = useState(
    'Simplify Your Business with POS Nepal'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    'All-in-one POS, inventory management, and billing solution for Nepalese businesses'
  );
  const [ctaText, setCtaText] = useState('Get Started Free');
  const [featuresContent, setFeaturesContent] = useState(
    '- Manage products & inventory\n- Generate professional invoices\n- Track sales & revenue\n- Multi-tenant cloud platform\n- Nepali payment gateway support\n- 24/7 customer support'
  );

  // Social media state
  const [socials, setSocials] = useState({
    facebook: { enabled: true, url: 'https://facebook.com/posnepal' },
    instagram: { enabled: true, url: 'https://instagram.com/posnepal' },
    whatsapp: { enabled: false, url: 'https://wa.me/9779800000000' },
  });

  const toggleSocial = (key: keyof typeof socials) => {
    setSocials((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateSocialUrl = (key: keyof typeof socials, url: string) => {
    setSocials((prev) => ({
      ...prev,
      [key]: { ...prev[key], url },
    }));
  };

  const saveLanding = () => toast.success('Landing page content saved (mock)');
  const saveSocial = () => toast.success('Social media settings saved (mock)');

  const featuresList = featuresContent
    .split('\n')
    .filter((l) => l.trim());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content & Social Media"
        description="Manage landing page content and social media links"
      />

      <Tabs defaultValue="landing">
        <TabsList>
          <TabsTrigger value="landing">Landing Page</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* Landing Page Tab */}
        <TabsContent value="landing">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Content</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hero-title">Hero Title</Label>
                  <Input
                    id="hero-title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cta-text">CTA Button Text</Label>
                  <Input
                    id="cta-text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="features-content">Features Section Content</Label>
                  <Textarea
                    id="features-content"
                    value={featuresContent}
                    onChange={(e) => setFeaturesContent(e.target.value)}
                    rows={8}
                  />
                </div>
                <Button onClick={saveLanding}>Save Content</Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>Preview</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-gradient-to-b from-primary/5 to-transparent p-6">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {heroTitle || 'Hero Title'}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {heroSubtitle || 'Hero subtitle will appear here'}
                  </p>
                  <Button className="mt-4" size="sm">
                    {ctaText || 'CTA Button'}
                  </Button>
                  <Separator className="my-6" />
                  <h3 className="text-sm font-semibold mb-3">Features</h3>
                  <ul className="space-y-2">
                    {featuresList.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {item.replace(/^-\s*/, '')}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Facebook */}
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Facebook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold">Facebook</h3>
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fb-toggle">Enabled</Label>
                    <Switch
                      id="fb-toggle"
                      checked={socials.facebook.enabled}
                      onCheckedChange={() => toggleSocial('facebook')}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fb-url">URL</Label>
                    <Input
                      id="fb-url"
                      value={socials.facebook.url}
                      onChange={(e) => updateSocialUrl('facebook', e.target.value)}
                      disabled={!socials.facebook.enabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instagram */}
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                  <Instagram className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="font-semibold">Instagram</h3>
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ig-toggle">Enabled</Label>
                    <Switch
                      id="ig-toggle"
                      checked={socials.instagram.enabled}
                      onCheckedChange={() => toggleSocial('instagram')}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ig-url">URL</Label>
                    <Input
                      id="ig-url"
                      value={socials.instagram.url}
                      onChange={(e) => updateSocialUrl('instagram', e.target.value)}
                      disabled={!socials.instagram.enabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold">WhatsApp</h3>
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wa-toggle">Enabled</Label>
                    <Switch
                      id="wa-toggle"
                      checked={socials.whatsapp.enabled}
                      onCheckedChange={() => toggleSocial('whatsapp')}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wa-url">URL</Label>
                    <Input
                      id="wa-url"
                      value={socials.whatsapp.url}
                      onChange={(e) => updateSocialUrl('whatsapp', e.target.value)}
                      disabled={!socials.whatsapp.enabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={saveSocial}>Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
