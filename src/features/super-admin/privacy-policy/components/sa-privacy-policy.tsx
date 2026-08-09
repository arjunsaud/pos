'use client';

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, FileText, Eye, RotateCcw, Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_CONTENT = `# Privacy Policy

## 1. Information We Collect

- **Account Information:** Name, email, phone number, business name, PAN number
- **Transaction Data:** Sales records, inventory data, billing information
- **Usage Data:** Login times, feature usage, device information
- **Payment Data:** Payment method preferences, transaction receipts

## 2. How We Use Your Information

- To provide and maintain the POS service
- To process payments and manage subscriptions
- To send notifications about your account
- To improve our service and develop new features
- To comply with legal obligations in Nepal

## 3. Data Storage and Security

- All data is encrypted at rest and in transit
- We use industry-standard security measures
- Data is stored on secure servers with regular backups
- Access to personal data is restricted to authorized personnel only

## 4. Data Sharing

We do not sell, trade, or rent your personal information to third parties. We may share data with:

- **Payment Processors:** eSewa, Khalti, and bank partners for payment processing
- **Legal Authorities:** When required by Nepali law
- **Service Providers:** Trusted partners who assist in operating our platform

## 5. Your Rights

- Access and download your data at any time
- Request correction of inaccurate information
- Request deletion of your account and data
- Opt out of non-essential communications

## 6. Cookies

We use essential cookies for authentication and session management. Analytics cookies are used only with your consent.

## 7. Data Retention

- Active account data is retained for the duration of your subscription
- Deleted account data is removed within 30 days
- Anonymized usage data may be retained for analytics

## 8. Children's Privacy

Our Service is not intended for use by children under 18 years of age.

## 9. Changes to This Policy

We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification.

## 10. Contact Us

For privacy-related inquiries, contact us at privacy@posnepal.com`;

function insertAtCursor(textarea: HTMLTextAreaElement, before: string, after: string = '') {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const replacement = before + selected + after;
  const newValue =
    textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  return { newValue, cursorPos: start + replacement.length };
}

function renderMarkdown(text: string): string {
  let html = text;

  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ## heading (h3)
  html = html.replace(/^## (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');

  // # heading (h2)
  html = html.replace(/^# (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');

  // **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // *italic*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // __underline__
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');

  // Numbered list items (1. text) -> wrap consecutive ones in <ol>
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inOrderedList = false;

  for (let i = 0; i < lines.length; i++) {
    const orderedMatch = lines[i].match(/^(\d+)\. (.+)$/);
    const unorderedMatch = lines[i].match(/^- (.+)$/);

    if (orderedMatch) {
      if (!inOrderedList) {
        processedLines.push('<ol class="list-decimal list-inside space-y-1 ml-4">');
        inOrderedList = true;
      }
      processedLines.push(`<li>${orderedMatch[2]}</li>`);
    } else {
      if (inOrderedList) {
        processedLines.push('</ol>');
        inOrderedList = false;
      }
      if (unorderedMatch) {
        processedLines.push(`<ul class="list-disc list-inside space-y-1 ml-4"><li>${unorderedMatch[1]}</li></ul>`);
      } else {
        processedLines.push(lines[i]);
      }
    }
  }
  if (inOrderedList) {
    processedLines.push('</ol>');
  }
  html = processedLines.join('\n');

  // Newlines to <br> (but not after block elements)
  html = html.replace(/\n/g, '<br>');

  // Clean up extra <br> after block elements
  html = html.replace(/<\/(h[23]|ol|ul)><br>/g, '</$1>');
  html = html.replace(/<br><(h[23])>/g, '<$1>');

  return html;
}

export default function SAPrivacyPolicy() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const result = insertAtCursor(textareaRef.current, before, after);
    setContent(result.newValue);
  };

  const handleSave = () => {
    toast.success('Privacy Policy saved successfully');
  };

  const handleReset = () => {
    setContent(DEFAULT_CONTENT);
    toast.info('Content reset to default');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Privacy Policy"
        description="Manage the privacy policy that appears on your landing page"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Privacy Policy Editor
          </CardTitle>
          <CardDescription>
            Edit the privacy policy content using the formatting toolbar below. Changes will be reflected on the landing page after saving.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/50 p-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Bold"
              onClick={() => handleFormat('**', '**')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Italic"
              onClick={() => handleFormat('*', '*')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Underline"
              onClick={() => handleFormat('__', '__')}
            >
              <Underline className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Heading 1"
              onClick={() => handleFormat('# ')}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Heading 2"
              onClick={() => handleFormat('## ')}
            >
              <Heading2 className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Bullet List"
              onClick={() => handleFormat('- ')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Numbered List"
              onClick={() => handleFormat('1. ')}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] w-full resize-y rounded-lg border border-border bg-background p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your privacy policy content here..."
          />

          {/* Preview Toggle & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={showPreview ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              This is how the content will appear on the landing page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
