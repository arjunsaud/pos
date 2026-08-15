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
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Camera,
  X,
  Megaphone,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Social media post mock data
const MOCK_POSTS = [
  {
    id: 'sp1',
    platform: 'facebook' as const,
    content: '🎉 Exciting news! POS Nepal just crossed 500 active stores across Nepal. Thank you for trusting us with your business! #POSNepal #NepalBusiness',
    likes: 234,
    comments: 45,
    shares: 18,
    date: '2024-06-14',
  },
  {
    id: 'sp2',
    platform: 'instagram' as const,
    content: 'Simplify your billing process with our new eSewa & Khalti integration. Now accepting digital payments is easier than ever! 📱💳',
    likes: 189,
    comments: 32,
    shares: 12,
    date: '2024-06-12',
  },
  {
    id: 'sp3',
    platform: 'twitter' as const,
    content: 'New feature alert: Multi-branch inventory sync is now available on Enterprise plan. Manage all your stores from one dashboard. 🚀',
    likes: 156,
    comments: 28,
    shares: 41,
    date: '2024-06-10',
  },
];

const PLATFORM_CONFIG = {
  facebook: {
    icon: Facebook,
    label: 'Facebook',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  instagram: {
    icon: Instagram,
    label: 'Instagram',
    iconBg: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
  twitter: {
    icon: Twitter,
    label: 'Twitter',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
};

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

  // Announcement banner state
  const [announcementText, setAnnouncementText] = useState(
    '🎉 System maintenance scheduled for June 20, 2024, 2:00 AM – 4:00 AM NPT. Services may be briefly unavailable.'
  );
  const [announcementVisible, setAnnouncementVisible] = useState(true);

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

      {/* Announcement Banner Preview */}
      {announcementVisible && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3">
          <Megaphone className="h-5 w-5 shrink-0 text-primary" />
          <p className="flex-1 text-sm text-foreground">{announcementText}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setAnnouncementVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!announcementVisible && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAnnouncementVisible(true)}
        >
          <Megaphone className="h-4 w-4" /> Show Announcement Banner
        </Button>
      )}

      <Tabs defaultValue="landing">
        <TabsList className="relative">
          <TabsTrigger value="landing">Landing Page</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* Landing Page Tab */}
        <TabsContent value="landing">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form */}
            <Card className="hover:shadow-md transition-shadow duration-200">
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
            <Card className="hover:shadow-md transition-shadow duration-200">
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
            <Card className="hover:shadow-md transition-shadow duration-200">
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
            <Card className="hover:shadow-md transition-shadow duration-200">
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
            <Card className="hover:shadow-md transition-shadow duration-200">
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

          {/* Social Media Post Cards */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_POSTS.map((post) => {
                const config = PLATFORM_CONFIG[post.platform];
                const PlatformIcon = config.icon;
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Image placeholder */}
                    <div className="relative h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <PlatformIcon className={cn('h-8 w-8 text-muted-foreground/30')} />
                      {/* Platform badge */}
                      <div className={cn(
                        'absolute top-2 left-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium backdrop-blur-sm',
                        config.iconBg
                      )}>
                        <PlatformIcon className={cn('h-3.5 w-3.5', config.iconColor)} />
                        <span className={config.iconColor}>{config.label}</span>
                      </div>
                      <Camera className="absolute bottom-2 right-2 h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      {/* Post content */}
                      <p className="text-sm line-clamp-3">{post.content}</p>
                      {/* Engagement row */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5" /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" /> {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5" /> {post.shares}
                        </span>
                      </div>
                      {/* Date */}
                      <p className="text-[11px] text-muted-foreground/70">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={saveSocial}>Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
