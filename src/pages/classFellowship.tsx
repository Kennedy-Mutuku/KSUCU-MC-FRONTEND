
import classImg from '../assets/class.png';

const ClassFellowship = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans">
            <div className="max-w-7xl mx-auto pt-8 pb-24 px-4 md:px-12">
                {/* Header Section */}
                <div className="mb-12 border-b-2 border-[#730051]/20 pb-6">
                    <h3 className="text-4xl md:text-5xl font-bold text-[#730051] mb-4">
                        Class Fellowship
                    </h3>
                    <p className="text-xl md:text-2xl font-light text-[#000000] opacity-80 max-w-3xl">
                        Uniting Students Across Years
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Content Section */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-[#ffffff] p-6 border-l-4 border-[#730051] shadow-sm">
                            <p className="text-lg leading-relaxed text-[#000000]">
                                Class fellowships are gatherings organized for students of specific year of study within the church community.
                                These fellowships provide a platform for members to connect, share experiences, and support each other in their spiritual journey.
                                These classes create an environment for deeper understanding of Scripture and meaningful fellowship.
                                Each class is designed to encourage participation, discussion, and spiritual growth in a friendly and supportive setting.
                                Class fellowships are usually held on Saturday mornings.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-[#000000] leading-relaxed">
                                They often include activities such as Bible study, prayer sessions, and social events that foster a sense of belonging and camaraderie among class members.
                            </p>

                            <div className="bg-[#730051]/5 p-6 rounded-lg">
                                <h4 className="text-[#730051] font-bold text-lg mb-3">Key Purpose</h4>
                                <p className="text-[#000000]">
                                    This is where members get to discuss topical issues and matters concerning the classes.
                                    The fellowships may be combined or separate as agreed by the responsible leaders.
                                </p>
                            </div>
                            <div className="bg-[#ffffff] border border-[#730051]/20 p-6 rounded-lg shadow-sm">
                                <h4 className="text-[#730051] font-bold text-lg mb-4 uppercase tracking-wider">Program Structure</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Structured Bible lessons</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Group discussions and sharing</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Prayer and mutual encouragement</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Fellowship and spiritual bonding</span>
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
                                    src={classImg}
                                    alt="Class Fellowship Group"
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-[#730051] bg-opacity-90 p-4 text-white">
                                    <p className="text-sm text-center italic text-white/90"> “Let the word of Christ dwell in you richly as you teach and admonish one another.” - Colossians 3:16</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassFellowship;