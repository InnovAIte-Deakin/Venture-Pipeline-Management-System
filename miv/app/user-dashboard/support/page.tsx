'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, Mail, Phone, FileText, Video, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I add a new venture to the platform?',
    answer:
      'Navigate to the Venture Intake section and fill out the comprehensive form. The platform will automatically analyse the venture and provide insights.',
  },
  {
    question: 'What are GEDSI metrics and how are they calculated?',
    answer:
      'GEDSI stands for Gender Equality, Disability, and Social Inclusion. These metrics are calculated based on your team composition, policies, and inclusion practices reported through the platform.',
  },
  {
    question: 'How can I export reports and data?',
    answer:
      'You can export reports from the Reports section. Select the report type, date range, and format (PDF, Excel, or CSV) then click the Export button.',
  },
  {
    question: 'Is my data secure and compliant?',
    answer:
      'Yes, all data is encrypted at rest and in transit. We comply with GDPR, SOC 2, and other major data protection regulations. Regular security audits are performed.',
  },
];

const resources = [
  {
    icon: FileText,
    title: 'Documentation',
    description: 'User guides & manuals',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step guides',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* FAQ and Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* FAQ Section */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">FAQ</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Get In Touch Section */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Get In
              <br />
              Touch
            </h2>

            {/* Contact Cards */}
            <div className="space-y-4 mb-8">
              {/* Address */}
              <div className="flex items-center gap-4 bg-teal-600 text-white rounded-xl px-5 py-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">#1381, National Rd 2,</p>
                  <p className="font-medium">Phnom Penh, Cambodia</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 bg-teal-600 text-white rounded-xl px-5 py-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:support@miv.com" className="font-medium hover:underline">
                  support@miv.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 bg-teal-600 text-white rounded-xl px-5 py-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="tel:+85517350544" className="font-medium hover:underline">
                  +855 17 350 544
                </a>
              </div>
            </div>

            {/* Support Hours */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Support Hours</h3>
              <div className="text-gray-600 space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <button
                key={index}
                className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 hover:shadow-md transition-shadow text-left"
              >
                <div
                  className={`w-12 h-12 ${resource.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${resource.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
