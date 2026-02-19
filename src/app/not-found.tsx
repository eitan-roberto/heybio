import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-top p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-pink rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="zap" className="w-12 h-12 text-top" />
        </div>
        
        <h1 className="text-6xl font-bold text-bottom mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-bottom mb-4">Page not found</h2>
        <p className="text-mid mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Icon icon="arrow-left" className="w-4 h-4 mr-2" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/new">Create a page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
