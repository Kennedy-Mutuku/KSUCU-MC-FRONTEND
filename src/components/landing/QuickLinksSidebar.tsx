import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Heart,
  BookOpen,
  Library,
  Package,
  DollarSign,
  GraduationCap,
  MessageCircleHeart,
} from 'lucide-react';

interface QuickLink {
  icon: React.ElementType;
  label: string;
  action: () => void;
}

interface QuickLinksSidebarProps {
  isLoggedIn?: boolean;
}

const QuickLinksSidebar = ({ isLoggedIn = false }: QuickLinksSidebarProps) => {
  const navigate = useNavigate();

  const quickLinks: QuickLink[] = [
    {
      icon: Camera,
      label: 'Media',
      action: () => {
        if (isLoggedIn) {
          navigate('/media');
        } else {
          navigate('/signIn');
        }
      },
    },
    {
      icon: Heart,
      label: 'Win a Soul',
      action: () => navigate('/save'),
    },
    {
      icon: BookOpen,
      label: 'Constitution',
      action: () => {
        const link = document.createElement('a');
        link.href = '/pdfs/constitution.pdf';
        link.download = 'constitution.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    {
      icon: Library,
      label: 'Library',
      action: () => navigate('/library'),
    },
    {
      icon: Package,
      label: 'Requisitions',
      action: () => navigate('/requisitions'),
    },
    {
      icon: DollarSign,
      label: 'Financials',
      action: () => navigate('/financial'),
    },
    {
      icon: GraduationCap,
      label: 'Bible Study',
      action: () => navigate('/Bs'),
    },
    {
      icon: MessageCircleHeart,
      label: 'Compassion',
      action: () => navigate('/compassion-counseling'),
    },
  ];

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
      {quickLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <button
            key={index}
            onClick={link.action}
            className="group relative w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
            aria-label={link.label}
          >
            <Icon size={18} className="text-gray-500 group-hover:text-[#730051] transition-colors" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
              {link.label}
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 border-4 border-transparent border-l-gray-900" />
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickLinksSidebar;
