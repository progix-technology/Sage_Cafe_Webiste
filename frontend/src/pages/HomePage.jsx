import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { BlankWaveSection } from '../components/home/BlankWaveSection';
import { HeroWaveSection } from '../components/home/HeroWaveSection';
import { GoodPeopleStorySection } from '../components/home/GoodPeopleStorySection';
import { DaysAtSageSection } from '../components/home/DaysAtSageSection';
import { BrewedSlowlySection } from '../components/home/BrewedSlowlySection';
import { FoodGatheringSection } from '../components/home/FoodGatheringSection';
import { AtmosphereScrollSection } from '../components/home/AtmosphereScrollSection';
import { EveningAtmosphereSection } from '../components/home/EveningAtmosphereSection';
import { YourTableAwaitsSection } from '../components/home/YourTableAwaitsSection';

export const HomePage = () => {
  return (
    <main className="w-full bg-white">
      {/* 1. Hero Screen with Pinned Background + Curved Arc Typography */}
      <HeroSection />

      {/* 2. Story Carousel (Chapters 01 to 05) */}
      <BlankWaveSection />

      {/* 3. Arrival Wave Section: Mediterranean Terrace & Atmosphere (2ndimage.png) */}
      <HeroWaveSection />

      {/* 4. Good People, Great Coffee (Section 2 from Reference) */}
      <GoodPeopleStorySection />

      {/* 5. Days at Sagē (Section 3: 4 Moment Cards Grid) */}
      <DaysAtSageSection />

      {/* 6. Brewed Slowly (Section 4: Signature Drink Feature) */}
      <BrewedSlowlySection />

      {/* 7. Food Worth Gathering For (Section 5: Category Highlights) */}
      <FoodGatheringSection />

      {/* 8. Fullscreen Experience Scroll Showcase (Sunlit Terrace, Reading Room Library, Open Mic Night) */}
      <AtmosphereScrollSection />

      {/* 9. Sagē Café Evening Atmosphere & Calendar Events (Sections 6 & 7) */}
      <EveningAtmosphereSection />

      {/* 10. Your Table Awaits (Fullbleed 2ndimage.png Banner & Reservation CTA) */}
      <YourTableAwaitsSection />
    </main>
  );
};

export default HomePage;
