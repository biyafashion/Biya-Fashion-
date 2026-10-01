import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import STORE_CONFIG from '../config/storeConfig';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error('Please enter your name and message.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to Biya Fashion support.');
  };

  const handleDirectWhatsApp = () => {
    const msg = `Hello BIYA FASHION Team,\n\nI have an inquiry regarding your apparel collection.\n\nMy Name: ${formData.name || 'Valued Customer'}\nMessage: ${formData.message || 'I would like to inquire about sizing and availability.'}`;
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const faqs = [
    {
      q: 'How do I track my order?',
      a: 'Once your order is confirmed, our team will dispatch it within 24 hours. You will receive updates via WhatsApp on your registered mobile number.',
    },
    {
      q: 'What are your return and exchange conditions?',
      a: 'We offer a 7-day hassle-free return window. Garments must be unwashed, unworn, and have all original Biya Fashion tags intact.',
    },
    {
      q: 'How do I pay for my order?',
      a: 'We accept payments via UPI, Google Pay, PhonePe, and Bank Transfer through our official WhatsApp (+91 96556 25186) upon order confirmation.',
    },
  ];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto" data-aos="fade-down">
          <span className="text-xs font-bold uppercase tracking-widest text-[#064C32] bg-[#064C32]/5 px-3 py-1 rounded-full">
            Customer Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] mt-2">
            Contact Biya Fashion
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
            Have questions about an order, styling advice, or wholesale bulk inquiries? Our dedicated fashion support team is here to assist.
          </p>
        </div>

        {/* SPECIAL THANKS - Tribute to Beloved Brother Thangapandii */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064C32] via-[#033B27] to-[#012216] text-white p-6 sm:p-10 border-2 border-[#D9A514]/30 shadow-2xl" data-aos="zoom-in" data-aos-duration="900">
          {/* Subtle Royal Background Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A514]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#064C32]/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A514]/15 border border-[#D9A514]/40 text-[#F3D477] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#F3D477]" />
              <span>SPECIAL THANKS</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F3D477]" />
            </div>

            {/* Heartfelt Message */}
            <blockquote className="font-serif text-base sm:text-xl md:text-2xl font-medium text-white/95 leading-relaxed italic">
              "A Heartfelt Thank You to My Beloved Brother, <strong className="text-[#F3D477] font-serif not-italic font-bold">Thangapandii</strong>, for Being a Great Inspiration Behind My Business Journey. Your Constant Support, Encouragement, and Belief in Me Mean More Than Words Can Express."
            </blockquote>

            {/* Signature & Brand Seal */}
            <div className="pt-2 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#D9A514] fill-[#D9A514]" />
                <span className="font-serif font-black tracking-widest text-sm text-[#F3D477]">
                  BIYA FASHION
                </span>
                <Heart className="w-4 h-4 text-[#D9A514] fill-[#D9A514]" />
              </div>
              <span className="text-[10px] tracking-[0.25em] text-[#E5E5E5]/70 uppercase font-medium">
                WEAR YOUR STYLE • FOUNDATION OF LOVE & GRATITUDE
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Direct Details + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4" data-aos="fade-right">
            {/* WhatsApp Quick Card */}
            <div className="p-6 rounded-3xl bg-[#064C32] text-white space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#F3D477]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Instant WhatsApp Concierge</h3>
                  <p className="text-xs text-gray-300">Fastest response within minutes</p>
                </div>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                Connect directly with our BIYA FASHION team on WhatsApp for instant sizing recommendations and live order tracking.
              </p>
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Support Details Cards */}
            <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4 text-xs text-[#666666]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#064C32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#111111]">Showroom & Atelier Address</h4>
                  <p className="mt-0.5 leading-relaxed">{STORE_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#064C32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#111111]">Phone Helpline</h4>
                  <p className="mt-0.5">{STORE_CONFIG.supportPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#064C32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#111111]">Email Inquiries</h4>
                  <p className="mt-0.5">{STORE_CONFIG.supportEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#064C32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#111111]">Support Hours</h4>
                  <p className="mt-0.5">Monday – Saturday: 10:00 AM – 7:30 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#F8F8F8] p-6 sm:p-8 rounded-3xl border border-[#E5E5E5]" data-aos="fade-left">
            <h2 className="font-serif font-bold text-xl text-[#111111] mb-1">
              Send us a Message
            </h2>
            <p className="text-xs text-[#666666] mb-6">
              Fill out the form below and we will get back to you within 24 business hours.
            </p>

            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#064C32]/10 text-[#064C32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#111111]">Message Received</h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  Thank you for reaching out to Biya Fashion. A member of our concierge team will respond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#064C32] uppercase tracking-wider hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    >
                      <option value="Order Inquiry">Order Inquiry</option>
                      <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
                      <option value="Returns & Exchanges">Returns & Exchanges</option>
                      <option value="Wholesale / Bulk Order">Wholesale / Bulk Order</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you today?"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#F3D477]" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-10 border-t border-[#E5E5E5]" data-aos="fade-up">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#064C32]">Quick Answers</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] mt-1">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5]" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="flex items-center gap-2 text-[#064C32] font-bold text-sm mb-2">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4>{faq.q}</h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
