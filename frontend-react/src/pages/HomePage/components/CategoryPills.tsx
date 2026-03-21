interface CategoryPillsProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const categories = [
  'All',
  'Fashion',
  'Electronics',
  'Food & Groceries',
  'Beauty',
  'Home & Living',
  'Health',
  'Art & Crafts'
];

export const CategoryPills = ({ selectedCategory, onSelect }: CategoryPillsProps) => {
  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`
            px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all duration-150
            ${selectedCategory === category
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};