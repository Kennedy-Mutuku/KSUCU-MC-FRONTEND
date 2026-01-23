import { Target, Eye, CheckCircle, BookOpen, Users, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const objectives = [
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
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-20 bg-gradient-to-b from-background to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4">
            Who We Are
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            About Us
          </h2>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-primary-100 rounded-lg">
                <Target size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Our Mission</h3>
            </div>
            <p className="text-text-secondary leading-relaxed">
              To impact Christian core values and skills to students through equipping,
              empowering, and offering a conducive environment for effective living in
              and out of campus.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-secondary-100 rounded-lg">
                <Eye size={20} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Our Vision</h3>
            </div>
            <p className="text-text-secondary leading-relaxed">
              A relevant and effective Christian to the church and society, equipped
              to make a lasting impact in every sphere of influence.
            </p>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft border border-border">
          <h3 className="text-xl font-bold text-text-primary mb-6 text-center">
            Our Objectives
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {objectives.map((objective, index) => {
              const Icon = objective.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-primary-50 rounded-lg">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      {objective.title}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      {objective.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-text-secondary mb-4">
              Ready to grow in faith and join our community?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/Bs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                <CheckCircle size={18} />
                Register for Bible Study
              </Link>
              <Link
                to="/signUp"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary text-primary font-medium rounded-lg hover:bg-primary-50 transition-colors"
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
