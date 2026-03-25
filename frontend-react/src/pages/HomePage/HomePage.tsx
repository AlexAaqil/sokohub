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
    <div className="pages_container">
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