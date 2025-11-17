import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ResumeShowcase from './ResumeShowcase';
import Footer from './Footer';
import FeaturesSection from './FeaturesSection';

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ResumeShowcase />
      <FeaturesSection />
      <Footer />

    </div>
  );
};

export default MainPage;
