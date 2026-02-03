import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col gap-1 bg-top overflow-x-hidden">
      <Header />

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="bg-bottom rounded-4xl p-10">
          <h1 className="text-4xl font-bold text-top mb-8">Privacy Policy</h1>
          
          <p className="text-top mb-8 opacity-70">Last updated: February 2026</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">1. Introduction</h2>
              <p className="text-top opacity-80 leading-relaxed">
                At HeyBio, we take your privacy seriously. This Privacy Policy explains how we 
                collect, use, and protect your personal information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">2. Information We Collect</h2>
              <p className="text-top opacity-80 leading-relaxed mb-4">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-top opacity-80 space-y-2 ml-4">
                <li><strong className="text-top">Account Information:</strong> Email address, password (encrypted)</li>
                <li><strong className="text-top">Profile Information:</strong> Display name, bio, avatar, links</li>
                <li><strong className="text-top">Usage Data:</strong> Page views, link clicks, device information</li>
                <li><strong className="text-top">Payment Information:</strong> Processed securely by LemonSqueezy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">3. How We Use Your Information</h2>
              <p className="text-top opacity-80 leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-top opacity-80 space-y-2 ml-4">
                <li>Provide and maintain our service</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send you important updates and notifications</li>
                <li>Improve our service and develop new features</li>
                <li>Prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">4. Data Storage and Security</h2>
              <p className="text-top opacity-80 leading-relaxed">
                Your data is stored securely using industry-standard encryption. We use Supabase 
                for database storage and implement appropriate technical and organizational measures 
                to protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">5. Third-Party Services</h2>
              <p className="text-top opacity-80 leading-relaxed">
                We use trusted third-party services to provide our service:
              </p>
              <ul className="list-disc list-inside text-top opacity-80 space-y-2 ml-4 mt-4">
                <li><strong className="text-top">Supabase:</strong> Authentication and database</li>
                <li><strong className="text-top">LemonSqueezy:</strong> Payment processing</li>
                <li><strong className="text-top">Vercel:</strong> Hosting and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">6. Cookies</h2>
              <p className="text-top opacity-80 leading-relaxed">
                We use essential cookies to maintain your session and provide core functionality. 
                We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">7. Analytics</h2>
              <p className="text-top opacity-80 leading-relaxed">
                We collect anonymous analytics data to understand how users interact with our service. 
                This helps us improve the user experience. You can opt out by using a browser extension 
                that blocks analytics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">8. Your Rights</h2>
              <p className="text-top opacity-80 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-top opacity-80 space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Object to certain processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">9. Data Retention</h2>
              <p className="text-top opacity-80 leading-relaxed">
                We retain your data as long as your account is active. When you delete your account, 
                we remove your personal information within 30 days, except where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">10. Changes to This Policy</h2>
              <p className="text-top opacity-80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes via email or through the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-top mb-4">11. Contact Us</h2>
              <p className="text-top opacity-80 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
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
