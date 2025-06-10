"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, Award, Beaker } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutContent() {
      setLoading(true);
      try {
        const response = await fetchApi("/content/about");
        setContent(response.data);
      } catch (error) {
        console.error("Failed to fetch about page content:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-10 mx-auto" />
          <Skeleton className="w-full h-[400px] mb-10 rounded-lg" />
        </div>
      </div>
    );
  }

  return ( 
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16"> 
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-8 shadow-lg">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            About MuscelX
          </h1>
          <div className="flex items-center justify-center text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">•</span>
            <span className="text-red-600 font-medium">About Us</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in fitness and nutrition since 2010
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/about-story.jpg"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Founded in 2010, MuscelX has grown from a small supplement store to one of India's leading fitness nutrition brands. Our journey began with a simple mission: to provide high-quality, scientifically-backed supplements that help people achieve their fitness goals.
                </p>
                <p className="mt-4">
                  Today, we're proud to serve thousands of fitness enthusiasts across the country, offering a wide range of products that meet the highest standards of quality and efficacy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="h-8 w-8" />,
                title: "Quality First",
                description: "We never compromise on the quality of our products, ensuring each supplement meets the highest standards."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Customer Focus",
                description: "Your success is our success. We're committed to providing exceptional service and support."
              },
              {
                icon: <Beaker className="h-8 w-8" />,
                title: "Scientific Approach",
                description: "Our products are backed by scientific research and formulated for maximum effectiveness."
              }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6 text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Our Team
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "John Doe",
                role: "Founder & CEO",
                image: "/team/john-doe.jpg"
              },
              {
                name: "Jane Smith",
                role: "Head of Product Development",
                image: "/team/jane-smith.jpg"
              },
              {
                name: "Mike Johnson",
                role: "Fitness Expert",
                image: "/team/mike-johnson.jpg"
              },
              {
                name: "Sarah Wilson",
                role: "Customer Success",
                image: "/team/sarah-wilson.jpg"
              }
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-medium">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
