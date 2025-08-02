import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Header';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import Footer from '../../components/Footer';
import TodayOfferShow from './components/TodayOfferShow';
import OfferCTASection from './components/OfferCtaSection';

const Homepage = () => {
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  return (
    <>
      <Helmet>
        {/* Page Title */}
        <title>Best AI Dropshipping Platform</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Abinexis is an AI-powered dropshipping platform that offers smart automation, fast order fulfillment, and all-in-one tools to help launch, grow, and scale your online e-commerce business."
        />

        {/* Keywords for SEO (including product categories) */}
        <meta
          name="keywords"
          content="AI dropshipping platform, E-commerce automation, Dropshipping software, Smart order fulfillment, Online business tools, Dropshipping for beginners, Sell products with AI, No-inventory store, Kitchen, Health, Fashion, Beauty, Electronics, Fitness, Spiritual, Kids, Pets, Stationery"
        />

        {/* Open Graph (for general sharing) */}
        <meta property="og:title" content="Abinexis - Where AI Meets Commerce" />
        <meta
          property="og:description"
          content="Launch and scale your online store with Abinexis: an AI-powered dropshipping platform with automation, analytics, and real-time product sourcing."
        />
        <meta property="og:image" content="https://abinexis.com/images/abinexis-og-image.png" /> {/* Use full URL */}
        <meta property="og:url" content="https://abinexis.com/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-black min-h-screen">
        <Header />
        <HeroSection />
        <OfferCTASection />
        <div id="categories">
          <CategoriesSection />
        </div>
        <TodayOfferShow />
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
