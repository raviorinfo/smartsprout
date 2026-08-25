import React from "react";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Kiddleaf 🌱",
  description: "Get in touch with the Kiddleaf team for support, feedback, or business inquiries.",
  alternates: {
    canonical: "https://kiddleaf.com/contact",
  }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-sprout-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-candy-blue to-ocean-deep shadow-glow-blue mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-ocean-900">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 font-body">
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-sprout-100 space-y-6">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-ocean-600" />
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-800">Email Support</h2>
            <p className="text-gray-600 font-body">
              For general questions, feedback, or technical support, please drop us an email.
            </p>
            <a href="mailto:arvaancorelogic@gmail.com" className="inline-block text-ocean-600 font-semibold hover:text-ocean-700 hover:underline">
              arvaancorelogic@gmail.com
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-sprout-100 space-y-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-heading font-bold text-gray-800">Response Time</h2>
            <p className="text-gray-600 font-body">
              We are a small team of passionate developers and parents. We aim to respond to all inquiries within 24-48 hours.
            </p>
            <p className="text-sm text-gray-500 italic">
              Business hours: Monday - Friday, 9am - 5pm EST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
