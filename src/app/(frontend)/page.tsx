import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'
import { ArrowRight, Users, Globe, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Inclusive Ventures
              <br />
              <span className="text-sky-100">Across Southeast Asia</span>
            </h1>
            <div className="flex justify-center">
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-sky-100">
                Supporting startups that champion gender equality, disability inclusion, and social
                impact across the Mekong region.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit-venture" className="bg-white rounded-lg hover:bg-sky-50">
                <span className="text-sky-600 px-8 py-4 font-semibold text-lg  transition-colors inline-flex items-center justify-center">
                  Submit Your Venture
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Link>
              <Link href="/login" className="h-full">
                <Button className="hover:bg-white hover:text-sky-600 bg-transparent border-2 p-8 text-lg font-semibold transition-colors inline-flex items-center justify-center">
                  Access Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mekong Inclusive Ventures is dedicated to fostering an inclusive startup ecosystem
              that prioritizes gender equality, disability inclusion, and social impact. We provide
              comprehensive support to ventures that are creating positive change across Southeast
              Asia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Gender Equality</h3>
              <p className="text-gray-600">
                Promoting women&apos;s leadership and gender-inclusive business practices across all
                ventures.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Disability Inclusion</h3>
              <p className="text-gray-600">
                Supporting ventures that create opportunities and accessibility for people with
                disabilities.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Social Impact</h3>
              <p className="text-gray-600">
                Driving sustainable solutions that address critical social and environmental
                challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Impact</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">150+</div>
              <div className="text-gray-600">Ventures Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">$2.5M</div>
              <div className="text-gray-600">Capital Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">8</div>
              <div className="text-gray-600">Countries Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">75%</div>
              <div className="text-gray-600">Women-Led Ventures</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">
            Join our community of changemakers and help build a more inclusive future for Southeast
            Asia.
          </p>
          <Link href="/sign-up" className="">
            <Button className="bg-white text-emerald-600 p-8 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors inline-flex items-center">
              <TrendingUp className="mr-2 w-5 h-5" />
              Submit Your Venture Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
