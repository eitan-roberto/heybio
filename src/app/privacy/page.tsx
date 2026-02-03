import Link from 'next/link';
import { SvgAsset } from '@/components/ui/svgasset';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-top">
      {/* Header */}
      <header className="bg-bottom px-4 md:px-10 py-4 rounded-bl-4xl rounded-br-4xl">
        <Link href="/" className="text-pink inline-block">
          <SvgAsset src="/logos/logo-full.svg" height={32} />
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-bottom mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-mid mb-6">Last updated: February 2026</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">1. Introduction</h2>
            <p className="text-mid">
              At HeyBio, we take your privacy seriously. This Privacy Policy explains how we 
              collect, use, and protect your personal information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">2. Information We Collect</h2>
            <p className="text-mid mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-mid space-y-2 ml-4">
              <li><strong>Account Information:</strong> Email address, password (encrypted)</li>
              <li><strong>Profile Information:</strong> Display name, bio, avatar, links</li>
              <li><strong>Usage Data:</strong> Page views, link clicks, device information</li>
              <li><strong>Payment Information:</strong> Processed securely by LemonSqueezy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">3. How We Use Your Information</h2>
            <p className="text-mid mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-mid space-y-2 ml-4">
              <li>Provide and maintain our service</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send you important updates and notifications</li>
              <li>Improve our service and develop new features</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">4. Data Storage and Security</h2>
            <p className="text-mid">
              Your data is stored securely using industry-standard encryption. We use Supabase 
              for database storage and implement appropriate technical and organizational measures 
              to protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">5. Third-Party Services</h2>
            <p className="text-mid">
              We use trusted third-party services to provide our service:
            </p>
            <ul className="list-disc list-inside text-mid space-y-2 ml-4 mt-4">
              <li><strong>Supabase:</strong> Authentication and database</li>
              <li><strong>LemonSqueezy:</strong> Payment processing</li>
              <li><strong>Vercel:</strong> Hosting and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">6. Cookies</h2>
            <p className="text-mid">
              We use essential cookies to maintain your session and provide core functionality. 
              We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">7. Analytics</h2>
            <p className="text-mid">
              We collect anonymous analytics data to understand how users interact with our service. 
              This helps us improve the user experience. You can opt out by using a browser extension 
              that blocks analytics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">8. Your Rights</h2>
            <p className="text-mid mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-mid space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Object to certain processing activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">9. Data Retention</h2>
            <p className="text-mid">
              We retain your data as long as your account is active. When you delete your account, 
              we remove your personal information within 30 days, except where required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">10. Changes to This Policy</h2>
            <p className="text-mid">
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes via email or through the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">11. Contact Us</h2>
            <p className="text-mid">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@heybio.co" className="text-pink hover:underline">
                hello@heybio.co
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-bottom px-4 md:px-10 py-8 rounded-tl-4xl rounded-tr-4xl mt-12">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-pink">
            <SvgAsset src="/logos/logo-full.svg" height={24} />
          </Link>
          <div className="flex items-center gap-6 text-sm text-high">
            <Link href="/privacy" className="hover:text-top">Privacy</Link>
            <Link href="/terms" className="hover:text-top">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
