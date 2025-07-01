"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Send,
  MessageSquare,
  Youtube,
  Headphones,
  CheckCircle,
  Dumbbell,
  Star,
  Shield,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";

export default function ContactPage() {
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetchApi("/content/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success(response.data.message || "Your message has been sent!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="container mx-auto px-4 py-28 ">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Dumbbell className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get In Touch With <span className="text-red-200">MuscleX</span>
            </h1>
            <div className="flex items-center justify-center text-sm text-red-100 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">•</span>
              <span className="text-white font-medium">Contact</span>
            </div>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your fitness journey? Our expert team is here
              to help you choose the perfect supplements for your goals.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16 -mt-8 relative z-10">
          {[
            {
              icon: <Phone className="h-6 w-6" />,
              title: "Call Us Now",
              info: "+91 98765 43210",
              subInfo: "Mon-Sat 9AM-7PM",
              color: "bg-red-600",
            },
            {
              icon: <Mail className="h-6 w-6" />,
              title: "Email Support",
              info: "support@Musclex.com",
              subInfo: "24/7 Response",
              color: "bg-blue-600",
            },
            {
              icon: <MessageSquare className="h-6 w-6" />,
              title: "Live Chat",
              info: "Instant Help",
              subInfo: "Online Now",
              color: "bg-green-600",
            },
            {
              icon: <MapPin className="h-6 w-6" />,
              title: "Visit Store",
              info: "Mumbai, India",
              subInfo: "See Location",
              color: "bg-purple-600",
            },
          ].map((contact, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 ${contact.color} rounded-xl mb-4 text-white`}
              >
                {contact.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{contact.title}</h3>
              <p className="text-gray-600 font-medium">{contact.info}</p>
              <p className="text-sm text-gray-500">{contact.subInfo}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <Send className="h-7 w-7 text-red-600" />
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Have questions about our supplements? Need personalized
                  fitness advice? We&apos;re here to help!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-base font-semibold text-gray-700"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-base font-semibold text-gray-700"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-base font-semibold text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-base font-semibold text-gray-700"
                    >
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                      required
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-base font-semibold text-gray-700"
                  >
                    Your Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-[160px] px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-y"
                    required
                    placeholder="Tell us about your fitness goals, ask about our supplements, or any other questions you have..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Your Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-6 w-6" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <Headphones className="h-6 w-6 text-red-600" />
                Contact Info
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Call Us</h4>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-gray-600">+91 98765 43211</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Mon-Sat: 9AM-7PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Email Us</h4>
                    <p className="text-gray-600">support@Musclex.com</p>
                    <p className="text-gray-600">info@Musclex.com</p>
                    <p className="text-sm text-gray-500 mt-1">24/7 Support</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      Visit Our Store
                    </h4>
                    <p className="text-gray-600">
                      123 Fitness Street, Gym City,
                      <br />
                      Maharashtra, India - 400001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border border-red-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Star className="h-5 w-5 text-red-600" />
                Why Choose MuscleX?
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <Shield className="h-4 w-4" />,
                    text: "100% Authentic Products",
                  },
                  {
                    icon: <Truck className="h-4 w-4" />,
                    text: "Free Shipping Above ₹999",
                  },
                  {
                    icon: <CheckCircle className="h-4 w-4" />,
                    text: "Expert Fitness Guidance",
                  },
                  {
                    icon: <Star className="h-4 w-4" />,
                    text: "5-Star Customer Reviews",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <Facebook className="h-5 w-5" />,
                    name: "Facebook",
                    color: "hover:bg-blue-50 hover:text-blue-600",
                  },
                  {
                    icon: <Instagram className="h-5 w-5" />,
                    name: "Instagram",
                    color: "hover:bg-pink-50 hover:text-pink-600",
                  },
                  {
                    icon: <Twitter className="h-5 w-5" />,
                    name: "Twitter",
                    color: "hover:bg-sky-50 hover:text-sky-600",
                  },
                  {
                    icon: <Youtube className="h-5 w-5" />,
                    name: "YouTube",
                    color: "hover:bg-red-50 hover:text-red-600",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`flex items-center gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 ${social.color} font-medium`}
                  >
                    {social.icon}
                    <span className="text-sm">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about our supplements and
              services
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How do I choose the right supplement?",
                a: "Our fitness experts provide free consultations to help you select supplements based on your goals, body type, and workout routine.",
              },
              {
                q: "Are your products authentic?",
                a: "Yes! All our products are 100% authentic, sourced directly from authorized distributors and manufacturers.",
              },
              {
                q: "What's your return policy?",
                a: "We offer a 30-day return policy for unopened products. Customer satisfaction is our top priority.",
              },
              {
                q: "Do you offer free shipping?",
                a: "Yes, we provide free shipping on all orders above ₹999 across India. Express delivery available in major cities.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h4 className="font-bold text-gray-800 mb-3">{faq.q}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
