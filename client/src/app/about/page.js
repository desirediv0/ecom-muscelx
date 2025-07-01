import Image from "next/image";
import { Dumbbell, Shield, Award, Zap, Target, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
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
              About <span className="text-red-200">MuscleX</span>
            </h1>
            <div className="flex items-center justify-center text-sm text-red-100 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">•</span>
              <span className="text-white font-medium">About Us</span>
            </div>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              India&apos;s most trusted fitness supplement brand, empowering
              athletes and fitness enthusiasts since 2010
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="MuscleX Story - Premium Gym Supplements"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Our Journey
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
                <p>
                  Founded in 2010 by fitness enthusiasts, MuscleX began as a
                  mission to provide premium quality supplements that actually
                  deliver results. We understood the frustration of investing in
                  products that promised the world but delivered nothing.
                </p>
                <p>
                  Today, we&apos;re proud to be India&apos;s leading fitness
                  nutrition brand, serving over 100,000+ satisfied customers
                  across the country. Our products are trusted by professional
                  athletes, bodybuilders, and fitness enthusiasts who demand
                  nothing but the best.
                </p>
                <p>
                  Every supplement we create undergoes rigorous testing and
                  quality control to ensure maximum potency, purity, and
                  effectiveness.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To empower every fitness enthusiast with scientifically-backed,
              premium quality supplements that accelerate their journey towards
              achieving their fitness goals and living their healthiest life.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To become the most trusted fitness nutrition brand globally, known
              for our unwavering commitment to quality, innovation, and helping
              people transform their lives through fitness.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Why Choose MuscleX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Premium Quality",
                description:
                  "Every product is manufactured in GMP-certified facilities with the highest quality standards. Third-party tested for purity and potency.",
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Proven Results",
                description:
                  "Trusted by 100,000+ customers and professional athletes. Our supplements are formulated based on scientific research and real-world results.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Expert Support",
                description:
                  "Our team of certified nutritionists and fitness experts are always ready to help you choose the right supplements for your goals.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6 text-white group-hover:bg-red-700 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-red-600 rounded-2xl p-8 md:p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            MuscleX by Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "100,000+", label: "Happy Customers" },
              { number: "50+", label: "Premium Products" },
              { number: "13+", label: "Years of Excellence" },
              { number: "500+", label: "Cities Served" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold">
                  {stat.number}
                </div>
                <div className="text-red-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have achieved their
            fitness goals with MuscleX supplements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-red-600 font-semibold rounded-xl border-2 border-red-600 hover:bg-red-50 transition-colors"
            >
              Get Expert Advice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
