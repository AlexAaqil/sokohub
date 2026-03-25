import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search shops, products, categories…"
        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
};