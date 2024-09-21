"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Istiak Al Imran",
      role: "Cheif Technology Officer",
      photo: "/images/istiak.jpg",
      email: "istial.al.imran@g.bracu.ac.bd",
      github: "https://github.com/IstiakImran",
    },
    {
      name: "Farjana Sadia Prome",
      role: "Cheif Marketing Officer",
      photo: "/images/farjana.jpg",
      email: "farjana.sadia.prome@g.bracu.ac.bd",
      github: "https://github.com/FarjanaProme08",
    },
    {
      name: "Md. Assaduzzaman",
      role: "Cheif Executive Officer",
      photo: "/images/asad.jpg",
      email: "md.asaduzzaman1@g.bracu.ac.bd",
      github: "https://github.com/asaduzzaman876",
    },
    {
      name: "Joy Sarkar",
      role: "Executive Designer 🙂",
      photo: "/images/joy.jpg",
      email: "jotee.sarkar.joy@g.bracu.ac.bd",
      github: "https://github.com/joysarkar077",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to our company! We are a team dedicated to providing top-notch
          services and solutions. Our mission is to innovate and bring the best
          products to our customers. We believe in teamwork, transparency, and
          creativity.
        </p>
        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700">
          To lead the industry by continuously innovating and delivering
          exceptional products that enhance the quality of life.
        </p>
      </section>

      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-500 mb-4">{member.role}</p>
              <p className="text-sm text-gray-500 mb-4"><Link href={`mailto:${member.email}`}>{member.email}</Link></p>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                <Button>GitHub</Button>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
