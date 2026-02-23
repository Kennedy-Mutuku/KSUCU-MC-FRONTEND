
import discipleshipImg from '../assets/discipleship.png';

const DiscipleshipClass = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans overflow-hidden">

            <div className="relative">
                <div className="max-w-7xl mx-auto pt-8 pb-24 px-4 md:px-12">
                    {/* Header Section */}
                    <div className="mb-12 border-b-2 border-[#730051]/20 pb-6">
                        <h3 className="text-4xl md:text-5xl font-bold text-[#730051] mb-4">
                            Discipleship Classes
                        </h3>
                        <p className="text-xl md:text-2xl font-light text-[#000000] opacity-80 max-w-3xl">
                            A Journey of Spiritual Growth
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
                        {/* Content Section */}
                        <div className="flex-1 space-y-8">
                            <div className="prose prose-lg max-w-none text-[#000000]">
                                <p className="text-lg leading-relaxed">
                                    Introduces the process of Discipleship to members and explains the whole process of becoming an effective disciple and a discipler.
                                    We also get to discuss several topical subjects that benefit spiritually and socially.
                                    Discipleship is at the heart of our church's mission. It is a lifelong journey of learning, obedience, and transformation as we grow to become more like Christ.
                                    Our discipleship program focuses on spiritual maturity, biblical foundations, character formation, and practical Christian living. Through teaching, mentoring, and accountability, believers are equipped to live out their faith and make disciples of others.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#ffffff] p-6 rounded-lg shadow-sm border border-[#730051]/10 border-t-4 border-t-[#730051]">
                                    <h4 className="text-[#730051] font-bold text-lg mb-2">Schedule</h4>
                                    <p className="text-[#000000]">Every Monday</p>
                                    <p className="text-[#000000] font-medium">6:50pm - 8:50pm</p>
                                </div>
                                <div className="bg-[#ffffff] p-6 rounded-lg shadow-sm border border-[#730051]/10 border-t-4 border-t-[#730051]">
                                    <h4 className="text-[#730051] font-bold text-lg mb-4">Program Structure</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start text-[#000000]">
                                            <span className="mr-3 text-[#730051] font-bold">•</span>
                                            <span>Understanding the foundations of the Christian faith</span>
                                        </li>
                                        <li className="flex items-start text-[#000000]">
                                            <span className="mr-3 text-[#730051] font-bold">•</span>
                                            <span>Developing Christ-like character</span>
                                        </li>
                                        <li className="flex items-start text-[#000000]">
                                            <span className="mr-3 text-[#730051] font-bold">•</span>
                                            <span>Spiritual disciplines: prayer, study, and service</span>
                                        </li>
                                        <li className="flex items-start text-[#000000]">
                                            <span className="mr-3 text-[#730051] font-bold">•</span>
                                            <span>Mentorship and accountability</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        {/* Image Section */}
                        <div className="w-full lg:w-5/12">
                            <div className="relative group">
                                <div className="absolute -inset-4 border-2 border-[#730051] rounded-2xl opacity-20 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                    <img
                                        src={discipleshipImg}
                                        alt="Discipleship Class Session"
                                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#730051] bg-opacity-90 p-4 text-white">
                                        <p className="font-medium text-center">Making Disciples who make Disciples</p>
                                        <p className="text-sm text-center italic mt-2 text-white/90"> “Therefore go and make disciples of all nations…” - Matthew 28:19</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscipleshipClass;