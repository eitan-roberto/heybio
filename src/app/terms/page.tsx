import Link from 'next/link';
import { SvgAsset } from '@/components/ui/svgasset';

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-bottom mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-mid mb-6">Last updated: February 2026</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">1. Acceptance of Terms</h2>
            <p className="text-mid">
              By accessing and using HeyBio, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">2. Description of Service</h2>
            <p className="text-mid">
              HeyBio provides a platform for creating and hosting link-in-bio pages. 
              We reserve the right to modify, suspend, or discontinue any part of the service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">3. User Accounts</h2>
            <p className="text-mid">
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account. You must immediately notify us 
              of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">4. Acceptable Use</h2>
            <p className="text-mid mb-4">You agree not to use HeyBio to:</p>
            <ul className="list-disc list-inside text-mid space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Share illegal, harmful, or offensive content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for spam or phishing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">5. Payment Terms</h2>
            <p className="text-mid">
              Pro subscriptions are billed monthly. You can cancel at any time, and you will 
              continue to have access until the end of your billing period. Refunds are provided 
              at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">6. Termination</h2>
            <p className="text-mid">
              We reserve the right to terminate or suspend your account at any time for violations 
              of these terms. You may also delete your account at any time from your settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">7. Limitation of Liability</h2>
            <p className="text-mid">
              HeyBio is provided &quot;as is&quot; without warranties of any kind. We are not liable 
              for any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">8. Changes to Terms</h2>
            <p className="text-mid">
              We may update these terms from time to time. We will notify you of any significant 
              changes via email or through the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-bottom mb-4">9. Contact</h2>
            <p className="text-mid">
              If you have any questions about these Terms, please contact us at{' '}
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
