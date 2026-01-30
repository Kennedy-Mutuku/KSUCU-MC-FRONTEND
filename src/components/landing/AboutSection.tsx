import { Target, Eye, BookOpen, Users, Heart, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Objective {
  title: string;
  description: string;
  icon: React.ElementType;
  link?: string;
  linkText?: string;
}

const objectives: Objective[] = [
  {
    title: 'Discipleship',
    description: 'Deepen and strengthen spiritual lives through Bible study, prayers, and Christian fellowship.',
    icon: BookOpen,
  },
  {
    title: 'Evangelism',
    description: 'Witness to the Lord Jesus and lead others to personal faith in Him.',
    icon: Users,
  },
  {
    title: 'Mission & Compassion',
    description: 'Prepare students to take good news to all nations and serve communities.',
    icon: Heart,
  },
  {
    title: 'Leadership Development',
    description: 'Identify and develop Christian leaders through training and experience.',
    icon: Award,
    link: '/worship-docket-admin',
    linkText: 'administer',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-6 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-3 md:mb-12">
          <span className="inline-block px-3 py-1 bg-purple-100 text-[#730051] text-sm font-medium rounded-full mb-4">
            Who We Are
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            About Us
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-12">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg">
                <Target size={20} className="text-[#730051]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To impact Christian core values and skills to students through equipping,
              empowering, and offering a conducive environment for effective living in
              and out of campus.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 rounded-lg">
                <Eye size={20} className="text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              A relevant and effective Christian to the church and society, equipped
              to make a lasting impact in every sphere of influence.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Our Objectives
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {objectives.map((objective, index) => {
              const Icon = objective.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-purple-50 rounded-lg">
                    <Icon size={20} className="text-[#730051]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {objective.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {objective.description}
                      {objective.link && (
                        <>
                          {' '}
                          <Link
                            to={objective.link}
                            className="text-[#730051] hover:text-[#5a0040] underline font-medium transition-colors"
                          >
                            {objective.linkText || 'Learn more'}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              Ready to grow in faith and join our community?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/Bs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#730051] text-white font-medium rounded-lg hover:bg-[#5a0040] transition-colors"
              >
                <CheckCircle size={18} />
                Register for Bible Study
              </Link>
              <Link
                to="/signUp"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#730051] text-[#730051] font-medium rounded-lg hover:bg-purple-50 transition-colors"
              >
                Join KSUCU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
