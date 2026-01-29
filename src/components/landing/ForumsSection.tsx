import { useState, useEffect } from 'react';
import { Clock, BookOpen, Trophy, Code, Globe, Rocket, X, Lightbulb } from 'lucide-react';

interface Forum {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  details: string;
  link?: string; // Added optional link property
}

const forums: Forum[] = [
  {
    id: 'prayer',
    title: 'Joint Prayer Time',
    icon: Clock,
    description: 'Daily prayer gatherings',
    details: 'KSUCU-MC joint prayers are conducted every day from 8:50 PM to 9:30 PM and in the morning from 5:00 AM to 6:00 AM. Venues are communicated before time. On Wednesdays, students meet at Gethsemane from 1 PM to 2 PM and 5 PM to 6 PM for prayers and fasting.',
  },
  {
    id: 'biblestudy',
    title: 'Bible Study Nights',
    icon: BookOpen,
    description: 'Deep dive into scripture',
    details: 'Join us for in-depth Bible study sessions where we explore God\'s word together. Our studies are designed to help you understand and apply biblical principles in your daily life.',
  },
  {
    id: 'development',
    title: 'Development Projects',
    icon: Trophy,
    description: 'Community impact initiatives',
    details: 'Be part of meaningful development projects that make a difference in our community. From outreach programs to infrastructure support, we work together to serve others.',
  },
  {
    id: 'graphics',
    title: 'Graphic Design Classes',
    icon: Code,
    description: 'Learn creative skills',
    details: 'Develop your creative skills through our graphic design classes. Learn industry-standard tools and techniques to serve the ministry and build valuable professional skills.',
  },
  {
    id: 'kairos',
    title: 'Kairos Course Training',
    icon: Globe,
    description: 'Missions and world view',
    details: 'The Kairos Course is a missions training program that will expand your worldview and equip you to participate in God\'s global mission. Join us for this transformative experience.',
  },
  {
    id: 'christianminds',
    title: 'Christian Minds',
    icon: Lightbulb,
    description: 'Dealing with contemporary issues',
    details: 'Christian Minds is a forum that addresses contemporary issues from a Christian perspective. Engage in thoughtful discussions and explore how faith intersects with modern challenges.',
    link: '/christianminds',
  },
  {
    id: 'focus',
    title: 'FOCUS Conferences',
    icon: Rocket,
    description: 'Annual student gatherings',
    details: 'FOCUS conferences bring together Christian students from across the region for worship, teaching, and fellowship. These events are life-changing experiences that strengthen faith and build community.',
  },
];

const ForumsSection = () => {
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);

  useEffect(() => {
    if (selectedForum) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedForum]);

  // Define base classes for the card to ensure identical styling for both button and link
  const cardClasses = "block w-full group p-6 bg-gray-50 rounded-xl border border-gray-200 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-purple-200";

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-purple-100 text-[#730051] text-sm font-medium rounded-full mb-4">
            Get Involved
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Other Interesting Forums
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Beyond our regular activities, we offer various forums for growth, service, and fellowship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {forums.map((forum) => {
            const Icon = forum.icon;
            
            // Render content inside the card
            const cardContent = (
              <>
                <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl mb-4 group-hover:bg-[#730051] transition-colors duration-300">
                  <Icon size={24} className="text-[#730051] group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {forum.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {forum.description}
                </p>
              </>
            );

            // If a link exists, render an anchor tag
            if (forum.link) {
              return (
                <a
                  key={forum.id}
                  href={forum.link}
                  className={cardClasses}
                >
                  {cardContent}
                </a>
              );
            }

            // Otherwise render the button that opens the modal
            return (
              <button
                key={forum.id}
                onClick={() => setSelectedForum(forum)}
                className={cardClasses}
              >
                {cardContent}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedForum && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedForum(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl">
                  <selectedForum.icon size={24} className="text-[#730051]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedForum.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForum(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {selectedForum.details}
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setSelectedForum(null)}
                className="flex-1 py-3 px-4 bg-[#730051] text-white font-medium rounded-lg hover:bg-[#5a0040] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ForumsSection;