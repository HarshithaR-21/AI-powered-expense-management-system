"use client"

import React, { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Link } from "react-router-dom"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

 const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};


  const features = [
    {
      icon: "⚡",
      title: "Instant Splits",
      description:
        "Add expenses and split them instantly among your group. No more manual calculations or confusion.",
    },
    {
      icon: "👥",
      title: "Smart Groups",
      description:
        "Create and manage multiple groups for different occasions. Keep track of all your shared expenses.",
    },
    {
      icon: "📊",
      title: "Minimal Transactions",
      description:
        "Our algorithm minimizes the number of transactions needed to settle all debts in your group.",
    },
  ]

  //Scroll animation for hero text
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -80]) // move up on scroll
  const opacity = useTransform(scrollY, [0, 200], [1, 0]) // fade out on scroll

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white font-bold">
              E
            </div>
            <span className="text-xl font-bold text-gray-900">EquiShare</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {["features", "how-it-works"].map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {id.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-900">
              <Link to={'/login'}>Log In</Link>
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium bg-blue-900 text-white rounded-md shadow-md hover:bg-blue-900 transition"
            >
              <Link to={'/signup'}>Sign Up</Link>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section with scroll effect */}
      <section className="relative py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div style={{ y, opacity }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Split Expenses
              <span className="text-blue-900"> Effortlessly</span>
              <br />
              with Friends
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Minimize transactions and maximize convenience.{" "}
              <b>EquiShare</b> intelligently calculates the most efficient way
              to settle group expenses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 text-lg font-medium bg-blue-900 text-white rounded-md shadow-md hover:bg-blue-900 transition"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EquiShare?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our smart algorithm ensures everyone pays their fair share with the
              minimum number of transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-blue-50 border rounded-lg shadow-sm cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Getting started with EquiShare is simple and straightforward.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {["Create a Group", "Add Expenses", "Settle Up"].map(
              (title, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-lg shadow-sm hover:shadow-md bg-white"
                >
                  <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {title}
                  </h3>
                  <p className="text-gray-600">
                    {[
                      "Start by creating a group and inviting your friends to join.",
                      "Record shared expenses and specify who participated in each one.",
                      "Get optimized settlement suggestions with minimal transactions.",
                    ][index]}
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Simplify Your Group Expenses?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join the users who have already simplified their group
          expense management with EquiShare.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 text-lg font-medium bg-white text-[#374151] rounded-md shadow hover:bg-gray-100"
        >
          Start Splitting Today
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        
          <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
            &copy; 2025 EquiShare. All rights reserved.
          </div>
        
      </footer>
    </div>
  )
}
