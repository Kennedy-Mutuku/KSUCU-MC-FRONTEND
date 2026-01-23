import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryItem {
  label: string;
  href: string;
}

interface CategorySectionProps {
  title: string;
  items: CategoryItem[];
  defaultOpen?: boolean;
}

const CategorySection = ({ title, items, defaultOpen = false }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-soft border border-border overflow-hidden transition-all duration-300 hover:shadow-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-base md:text-lg font-semibold text-text-primary">
          {title}
        </h3>
        <ChevronDown
          size={20}
          className={`text-text-secondary transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-4 pb-4 md:px-5 md:pb-5 space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className="block py-2.5 px-4 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 transition-all duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategorySection;
