import React from 'react';
import HeroSection from '../components/home/HeroSection';
import UpcomingEvents from '../components/home/UpcomingEvents';
import FeaturedClubs from '../components/home/FeaturedClubs';
import Chatbot from '../components/ui/Chatbot';
import RecruitmentForms from '../components/home/RecruitmentForms';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <UpcomingEvents />
      <FeaturedClubs />
      <RecruitmentForms />
      <Chatbot />

      
    </div>
  );
};

export default HomePage;