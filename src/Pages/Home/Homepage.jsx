import React ,{useEffect}from 'react';
import Header from '../../components/Header';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import Footer from '../../components/Footer';
import TodayOfferShow from './components/TodayOfferShow';
import OfferCTASection from './components/OfferCtaSection';


const Homepage = () => {
  
    useEffect(() => {
    // Handle hash navigation when page loads
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Small delay to ensure page is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Handle hash on page load
    handleHashNavigation();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);
  return (
    <div className="bg-black min-h-screen">
      <Header />
      <HeroSection />
      <OfferCTASection />
      <div id="categories">
        <CategoriesSection />
      </div>
      <TodayOfferShow/>
      <Footer />
    </div>
  );
};

export default Homepage;