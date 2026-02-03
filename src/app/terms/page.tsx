import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col gap-1 bg-top">
      <Header />

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="bg-bottom rounded-4xl p-10">
          <h1 className="text-4xl font-bold text-top mb-8">Terms of Service</h1>
          
          <p className="text-top mb-8 opacity-70">Last updated: February 2026</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">1. Acceptance of Terms</h2>
              <p className="text-top opacity-80 leading-relaxed">
                By accessing and using HeyBio, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">2. Description of Service</h2>
              <p className="text-top opacity-80 leading-relaxed">
                HeyBio provides a platform for creating and hosting link-in-bio pages. 
                We reserve the right to modify, suspend, or discontinue any part of the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">3. User Accounts</h2>
              <p className="text-top opacity-80 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account. You must immediately notify us 
                of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">4. Acceptable Use</h2>
              <p className="text-top opacity-80 leading-relaxed mb-4">You agree not to use HeyBio to:</p>
              <ul className="list-disc list-inside text-top opacity-80 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Share illegal, harmful, or offensive content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for spam or phishing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">5. Payment Terms</h2>
              <p className="text-top opacity-80 leading-relaxed">
                Pro subscriptions are billed monthly. You can cancel at any time, and you will 
                continue to have access until the end of your billing period. Refunds are provided 
                at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">6. Termination</h2>
              <p className="text-top opacity-80 leading-relaxed">
                We reserve the right to terminate or suspend your account at any time for violations 
                of these terms. You may also delete your account at any time from your settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">7. Limitation of Liability</h2>
              <p className="text-top opacity-80 leading-relaxed">
                HeyBio is provided &quot;as is&quot; without warranties of any kind. We are not liable 
                for any indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">8. Changes to Terms</h2>
              <p className="text-top opacity-80 leading-relaxed">
                We may update these terms from time to time. We will notify you of any significant 
                changes via email or through the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">9. Contact</h2>
              <p className="text-top opacity-80 leading-relaxed">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:hello@heybio.co" className="text-pink hover:underline">
                  hello@heybio.co
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
