import { useState } from 'react';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
// import { SearchBar } from '../../components/common/SearchBar/SearchBar';
import { CategoryPills } from './components/CategoryPills';
import { FeaturedShops } from './components/FeaturedShops';
import { HotDeals } from './components/HotDeals';

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="HomePage max-w-7xl mx-auto px-16 py-6">
      <Hero />
      <SearchBar />
      <CategoryPills 
        selectedCategory={'All'} 
        onSelect={setSelectedCategory} 
      />
      <FeaturedShops />
      <HotDeals />
    </div>
  );
};