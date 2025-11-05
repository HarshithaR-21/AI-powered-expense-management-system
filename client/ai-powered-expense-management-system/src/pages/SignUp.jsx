import React, { useState } from "react";
import { motion } from "framer-motion";
import InputField from "../components/InputField";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import {Link, useNavigate} from 'react-router-dom';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else {
      // Strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!strongPasswordRegex.test(formData.password)) {
        newErrors.password = "Password must include uppercase, lowercase, number, and special character"
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    setIsLoading(true)
    try {
      let response = await axios.post('http://localhost:8080/user/signup', formData, {withCredentials: true})
      if (response) {
        toast.success(response.data.message);
        setTimeout(() => {
            navigate('/login');
        }, 2000);
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch (error) {
      toast.error("Something went wrong");
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white font-bold">
              E
            </div>
            <span className="text-xl font-bold text-gray-900">EquiShare</span>
          </motion.div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors"
            >
              <Link to={'/login'}>Log In</Link>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Title Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join <span className="text-blue-900">EquiShare</span>
            </h1>
            <p className="text-gray-600">
              Start splitting expenses effortlessly with your friends
            </p>
          </motion.div>

          {/* Sign Up Form */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName">First Name</label>
                  <InputField id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} placeholder="Enter your first name" />
                  {errors.firstName && (
                    <motion.p
                      className="text-sm text-red-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.firstName}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName">Last Name</label>
                  <InputField
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "border-red-500" : ""}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <motion.p
                      className="text-sm text-red-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.lastName}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email">Email Address</label>
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <motion.p
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <InputField
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-red-500" : ""}
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <motion.p
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <InputField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <motion.p
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 text-lg font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

              </motion.div>
              <div className="w-full text-center border-b-2 border-gray-300 mt-2">
                or
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </motion.button>
            </form>

            {/* Terms and Privacy */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-blue-900 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-900 hover:underline">
                Privacy Policy
              </a>
            </p>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
          </motion.div>
        </div>
      </div>
    </div>
  )
}