import { useEffect, useState } from 'react';
import focusBanner from '../assets/focus_banner.png';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';

const Focus = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const fadeInUp = (delay: string) => `transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${delay}`;

    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans overflow-hidden">

            <div className="relative">
                {/* Hero Section */}
                <div className="relative h-[60vh] overflow-hidden">
                    <img
                        src={focusBanner}
                        alt="FOCUS Conference Banner"
                        className={`w-full h-full object-cover transition-transform duration-[2000ms] ${isVisible ? 'scale-100' : 'scale-110'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#730051]/90 via-[#730051]/40 to-transparent flex items-center justify-center">
                        <div className={`text-center text-white px-4 ${fadeInUp('delay-300')}`}>
                            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-lg">
                                FOCUS KENYA
                            </h1>
                            <p className="text-xl md:text-3xl font-light tracking-wide opacity-90">
                                Fellowship of Christian Unions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Intro Card */}
                        <div className={`bg-white p-8 rounded-2xl shadow-xl border-t-8 border-[#730051] col-span-1 lg:col-span-2 ${fadeInUp('delay-500')}`}>
                            <h2 className="text-3xl font-bold text-[#730051] mb-6 flex items-center gap-3">
                                <Users size={32} />
                                About FOCUS
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                The Fellowship of Christian Unions (FOCUS) Kenya is a non-doctrinal, non-denominational evangelical Christian student organization. We bring together Christian students from universities and colleges across Kenya for worship, teaching, and fellowship.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Our conferences are life-changing experiences that strengthen faith, build community, and equip students to be salt and light in their campuses and society.
                            </p>
                        </div>

                        {/* Quick Stats / Highlights */}
                        <div className={`space-y-4 ${fadeInUp('delay-700')}`}>
                            <div className="bg-[#730051] text-white p-6 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                <Calendar className="mb-4 opacity-80" size={32} />
                                <h3 className="text-xl font-bold mb-2">Annual Conferences</h3>
                                <p className="opacity-90">Gatherings that unite thousands of students.</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#730051]/10 transform hover:-translate-y-2 transition-transform duration-300">
                                <MapPin className="text-[#730051] mb-4" size={32} />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Regional Meets</h3>
                                <p className="text-gray-600">Impactful meetings in various regions.</p>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Ezra Conference', icon: <Heart size={40} />, desc: 'A discipleship conference focusing on scripture engagement and expository preaching.' },
                            { title: 'Commission Conference', icon: <Users size={40} />, desc: 'A missions mobilization conference held every few years to ignite a passion for global missions.' },
                            { title: 'Leadership Summit', icon: <Calendar size={40} />, desc: 'Equipping student leaders with skills and spiritual grounding for effective ministry.' }
                        ].map((item, index) => (
                            <div key={index} className={`bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-[#730051]/30 hover:shadow-xl transition-all duration-300 group ${fadeInUp(`delay-${index * 200 + 1000}`)}`}>
                                <div className="text-[#730051] mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className={`mt-20 text-center ${fadeInUp('delay-1000')}`}>
                        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#730051] to-purple-800">
                            <div className="bg-white rounded-full px-8 py-4 sm:px-12 sm:py-6">
                                <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#730051] to-purple-800">
                                    Join the Movement
                                </h2>
                            </div>
                        </div>
                        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                            Connect with the CU office to learn more about upcoming FOCUS events and how you can participate.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Focus;
