'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, Sparkles, Zap, Eye } from 'lucide-react';

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const handleUsernameChange = async (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(sanitized);
    
    if (sanitized.length >= 3) {
      setIsChecking(true);
      // TODO: Check availability via API
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsAvailable(true); // Mock: always available for now
      setIsChecking(false);
    } else {
      setIsAvailable(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length >= 3 && isAvailable) {
      router.push(`/new?slug=${username}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto"
      >
        <div className="text-xl font-semibold tracking-tight">HeyBio</div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm" onClick={() => router.push('/login')}>
            Log in
          </Button>
          <Button variant="outline" className="text-sm" onClick={() => router.push('/pricing')}>
            Pricing
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <main className="px-6 pt-20 pb-32 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Finally, a bio link
            <br />
            <span className="text-gray-400">that looks good.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-gray-500 max-w-xl mx-auto"
        >
          One page for everything you share. Stunning design. Lightning fast. Always free.
        </motion.p>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-10 max-w-md mx-auto"
        >
          <div className="flex items-center bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-2 focus-within:ring-2 focus-within:ring-gray-900/10 transition-shadow">
            <span className="text-gray-400 pl-4 text-lg">heybio.co/</span>
            <Input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="yourname"
              className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-300"
            />
            <Button 
              type="submit" 
              disabled={username.length < 3 || !isAvailable}
              className="rounded-xl px-6 py-6 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all"
            >
              <span className="mr-2">Get your free page</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Availability indicator */}
          {username.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm"
            >
              {isChecking ? (
                <span className="text-gray-400">Checking...</span>
              ) : isAvailable ? (
                <span className="text-emerald-600 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Available!
                </span>
              ) : (
                <span className="text-red-500">Already taken</span>
              )}
            </motion.div>
          )}
        </motion.form>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400"
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            No signup required
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Ready in seconds
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Beautiful by default
          </span>
        </motion.div>
      </main>

      {/* Features */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need, nothing you don't.
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              We focused on what actually matters. Beautiful pages that load fast and help you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Stunning themes',
                description: 'Pick from beautiful, curated themes. No design skills needed.',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Lightning fast',
                description: 'Your page loads in under a second. Better for visitors, better for SEO.',
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: 'Actionable analytics',
                description: 'Know what's working. See where your visitors come from and what they click.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-700 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simple, fair pricing
            </h2>
            <p className="mt-4 text-gray-500">
              Start free. Upgrade when you need more.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-white border border-gray-200"
            >
              <div className="text-sm font-medium text-gray-500 mb-2">Free</div>
              <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
              <p className="text-gray-500 mb-6">Everything you need to get started</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited links', '6 beautiful themes', 'Basic analytics', 'Social icons', 'Mobile optimized'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full py-6 rounded-xl" onClick={() => router.push('/new')}>
                Start for free
              </Button>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-gray-900 text-white relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                Popular
              </div>
              <div className="text-sm font-medium text-gray-400 mb-2">Pro</div>
              <div className="text-4xl font-bold mb-4">
                $4<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-6">For creators who want more</p>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', '12 premium themes', 'Advanced analytics', 'Priority support', 'No HeyBio badge'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full py-6 rounded-xl bg-white text-gray-900 hover:bg-gray-100">
                Upgrade to Pro
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © 2026 HeyBio. Made with ♥ for creators.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
