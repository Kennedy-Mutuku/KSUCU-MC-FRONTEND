
import { UserCheck, HeartHandshake, GraduationCap, Megaphone } from 'lucide-react';

const objectives = [
    {
        text: "To develop servant leaders who shall be transformative leaders both in the church and the society.",
        icon: UserCheck,
        title: "Servant Leadership"
    },
    {
        text: "To provide service opportunities through transitional leadership.",
        icon: HeartHandshake,
        title: "Service Opportunities"
    },
    {
        text: "To equip KSUCU-MC members with life skills for application during and post campus life.",
        icon: GraduationCap,
        title: "Life Skills"
    },
    {
        text: "They shall speak out to the issues affecting students to the administration and relevant institution.",
        icon: Megaphone,
        title: "Student Advocacy"
    }
];

const AboutSection = () => {
    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
                        Our Mandate
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#6c0a50] rounded-full"></span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Guided by our constitution, we exist to transform lives and serve our community through four key pillars.
                    </p>
                </div>

                {/* Objectives Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {objectives.map((obj, index) => {
                        const Icon = obj.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
                            >
                                <div className="w-14 h-14 bg-purple-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#6c0a50] transition-colors duration-300">
                                    <Icon size={28} className="text-[#6c0a50] group-hover:text-white transition-colors duration-300" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {obj.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {obj.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
