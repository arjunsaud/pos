'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Bold,
  Code,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react';

const TOOLS: Array<{ cmd: string; icon: typeof Bold; arg?: string; label: string }> = [
  { cmd: 'bold', icon: Bold, label: 'Bold' },
  { cmd: 'italic', icon: Italic, label: 'Italic' },
  { cmd: 'underline', icon: Underline, label: 'Underline' },
  { cmd: 'formatBlock', icon: Heading2, arg: 'h2', label: 'Heading' },
  { cmd: 'insertUnorderedList', icon: List, label: 'List' },
  { cmd: 'insertOrderedList', icon: ListOrdered, label: 'Numbered list' },
];

export function RichTextEditor({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div className={cn('overflow-hidden rounded-md border', className)}>
      <div className="flex flex-wrap gap-1 border-b bg-muted/40 p-1">
        {TOOLS.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            size="icon"
            variant="ghost"
            title={tool.label}
            onClick={() => {
              ref.current?.focus();
              document.execCommand(tool.cmd, false, tool.arg);
              onChange(ref.current?.innerHTML || '');
            }}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            document.execCommand(
              'insertHTML',
              false,
              '{{#items}}<div>{{name}} x{{quantity}} — NPR {{lineTotal}}</div>{{/items}}',
            );
            onChange(ref.current?.innerHTML || '');
          }}
        >
          Insert items
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        className="min-h-[220px] bg-background p-3 text-sm outline-none"
        onInput={() => onChange(ref.current?.innerHTML || '')}
        suppressContentEditableWarning
      />
    </div>
  );
}

export function HtmlSourceEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[280px] font-mono text-xs"
    />
  );
}

export function EditorModeToggle({
  source,
  onToggle,
}: {
  source: boolean;
  onToggle: () => void;
}) {
  return (
    <Button type="button" size="sm" variant="outline" onClick={onToggle}>
      <Code className="mr-2 h-4 w-4" />
      {source ? 'Visual editor' : 'HTML source'}
    </Button>
  );
}
