interface CategoryPillsProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryPills = ({ selectedCategory, onSelect }: CategoryPillsProps) => {
  const categories = [
    'All',
    'Fashion',
    'Electronics',
    'Food & Groceries',
    'Beauty & Wellness',
    'Home & Living',
    'Art & Crafts',
    'Health'
  ];

  return (
    <div className="flex gap-2 overflow-x-auto py-2 mb-4">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
            selectedCategory === cat
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};