"use client";

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Download from '../components/Download';
import Screenshots from '../components/Preview';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import WhyDevelopers from '../components/WhyDevelopers';
import GetRunning from '../components/GetRunning';
import FAQ from '../components/FAQ';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function Home() {
  useScrollAnimation();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Screenshots />
        <Download />
        <HowItWorks />
        <WhyDevelopers />
        <GetRunning />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
