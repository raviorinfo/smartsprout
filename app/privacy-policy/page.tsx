import React from "react";
import { Shield, Lock, Eye, Trash2, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy – Kiddleaf",
  description: "COPPA-compliant privacy policy for Kiddleaf kids learning platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sprout-50/50 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sprout-100 text-sprout-700 text-sm font-heading font-bold mb-4">
            <Shield className="w-4 h-4" />
            COPPA Compliant
          </div>
          <h1 className="text-4xl font-heading font-black text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500">
            Last updated: August 2026
          </p>
        </div>

        <div className="card-playful prose prose-gray max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-sprout-500" />
              <h2 className="text-xl font-heading font-bold text-gray-800 !mt-0">Our Commitment to Privacy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Kiddleaf (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting the privacy of children.
              We comply with the Children&apos;s Online Privacy Protection Act (COPPA) and all applicable privacy laws.
              This Privacy Policy explains our practices regarding information when you use our website and services.
            </p>
          </section>

          {/* No Data Collection */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-sky-medium" />
              <h2 className="text-xl font-heading font-bold text-gray-800 !mt-0">Information We Collect</h2>
            </div>
            <div className="bg-sprout-50 border border-sprout-200 rounded-2xl p-4">
              <p className="font-heading font-bold text-sprout-700 mb-2">
                🚫 We collect ZERO personal information from children.
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• We do not require user accounts or registration</li>
                <li>• We do not collect names, email addresses, or any personally identifiable information (PII)</li>
                <li>• Names entered in our story generator are processed in real-time and never stored on our servers</li>
                <li>• All generated content is stored locally in your browser&apos;s localStorage only</li>
                <li>• We do not use cookies for tracking purposes</li>
                <li>• We do not collect geolocation data</li>
              </ul>
            </div>
          </section>

          {/* Local Storage */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="w-5 h-5 text-candy-rose" />
              <h2 className="text-xl font-heading font-bold text-gray-800 !mt-0">Local Browser Storage</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Kiddleaf uses your browser&apos;s localStorage feature to save your &ldquo;Recent Creations&rdquo;
              (stories, worksheets, coloring pages, and activities) so you can revisit them.
              This data never leaves your device and can be cleared at any time by clearing your browser data.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-heading font-bold text-gray-800">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li><strong>OpenAI API:</strong> Used to generate stories, worksheets, and activities.
                No child data is stored by OpenAI beyond the request lifecycle.</li>
              <li><strong>Google AdSense:</strong> Configured with child-directed treatment tags
                (<code>data-tag-for-child-directed-treatment=&quot;1&quot;</code>) to ensure compliance with COPPA regulations.
                Interest-based advertising is disabled for child-directed content.</li>
            </ul>
          </section>

          {/* Parental Rights */}
          <section>
            <h2 className="text-xl font-heading font-bold text-gray-800">Parental Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              Since we do not collect any personal information from children, there is no
              stored data to review, modify, or delete. Parents can clear locally stored
              content by clearing their browser&apos;s localStorage.
            </p>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-lavender-medium" />
              <h2 className="text-xl font-heading font-bold text-gray-800 !mt-0">Contact Us</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy or our practices,
              please contact us at: <strong>arvaancorelogic@gmail.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
