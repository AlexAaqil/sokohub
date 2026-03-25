import { useState } from 'react';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
import { CategoryPills } from './components/CategoryPills';
import { FeaturedShops } from './components/FeaturedShops';
import { HotDeals } from './components/HotDeals';

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <Hero />
      <SearchBar onSearch={setSearchQuery} />
      <CategoryPills 
        selectedCategory={selectedCategory} 
        onSelect={setSelectedCategory} 
      />
      <FeaturedShops />
      <HotDeals />
    </div>
  );
};