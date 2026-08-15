import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T | null | undefined>;
  children: (value: T) => React.ReactNode;
}) {
  const data = await promise;

  if (!data) {
    return (
      <div className="max-w-xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Sorry, we are unable to load data from the server at the moment.
            Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return children(data);
}
