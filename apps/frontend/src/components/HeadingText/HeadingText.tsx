interface HeadingTextProps {
  title: string;
  subTitle: string;
}

export default function HeadingText({ title, subTitle }: HeadingTextProps) {
  return (
    <div>
      <h1 className="text-lg font-medium text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{subTitle}</p>
    </div>
  );
}
