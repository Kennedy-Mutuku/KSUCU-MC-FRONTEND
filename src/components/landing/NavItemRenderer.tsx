import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';
import type { NavItem } from '../../data/navigationData';

interface NavItemRendererProps {
  items: NavItem[];
  depth?: number;
  onLinkClick?: () => void;
}

const NavItemRenderer = ({ items, depth = 0, onLinkClick }: NavItemRendererProps) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <ul className={`space-y-1 ${depth > 0 ? 'ml-4 mt-1' : ''}`}>
      {items.map((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openItems.has(index);

        if (hasChildren) {
          return (
            <li key={index}>
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-lg text-gray-700 hover:text-[#730051] hover:bg-purple-50 transition-all duration-200 text-left"
              >
                <span className={depth === 0 ? 'font-medium' : ''}>{item.label}</span>
                <ChevronRight
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <NavItemRenderer
                  items={item.children!}
                  depth={depth + 1}
                  onLinkClick={onLinkClick}
                />
              </div>
            </li>
          );
        }

        // Leaf item - render as link
        if (item.external) {
          return (
            <li key={index}>
              <a
                href={item.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-gray-600 hover:text-[#730051] hover:bg-purple-50 transition-all duration-200"
                onClick={onLinkClick}
              >
                {item.label}
                <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
              </a>
            </li>
          );
        }

        return (
          <li key={index}>
            <Link
              to={item.href || '#'}
              className="block py-2.5 px-4 rounded-lg text-gray-600 hover:text-[#730051] hover:bg-purple-50 transition-all duration-200"
              onClick={onLinkClick}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItemRenderer;
