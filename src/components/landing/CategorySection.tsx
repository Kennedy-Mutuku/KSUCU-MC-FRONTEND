import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '../../data/navigationData';
import NavItemRenderer from './NavItemRenderer';

interface CategorySectionProps {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const CategorySection = ({ title, items, defaultOpen = false }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-800">
          {title}
        </h3>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 md:px-5 md:pb-5">
          <NavItemRenderer items={items} />
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
