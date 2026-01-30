
import UniversalHeader from '../components/UniversalHeader';
import sistersImg from '../assets/ladies.jpg';
import Footer from '../components/footer';


const SistersFellowship = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans overflow-hidden">
            <UniversalHeader />

            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 md:px-12">
                    {/* Header Section */}
                    <div className="mb-12 border-b-2 border-[#730051]/20 pb-6">
                        <h3 className="text-4xl md:text-5xl font-bold text-[#730051] mb-4 pt-12">
                            Sisters' Fellowship
                        </h3>
                        <p className="text-xl md:text-2xl font-light text-[#000000] opacity-80 max-w-3xl">
                            Empowering Women in Faith
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Content Section */}
                        <div className="flex-1 space-y-8">
                            <div className="prose prose-lg max-w-none text-[#000000]">
                                <p className="text-lg leading-relaxed">
                                    The Sisters' Fellowship is a vibrant community of women committed to growing spiritually, supporting one another, and serving God faithfully.
                                    It provides a safe and encouraging space where women of all ages can connect, learn, and walk together in their faith journey.
                                    Through Bible study, prayer, fellowship meetings, and outreach activities, we seek to build strong Christ-centered relationships that reflect God's love in our families, church, and community.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#ffffff] border border-[#730051]/20 p-6 rounded-lg hover:border-[#730051] transition-colors duration-300 shadow-sm hover:shadow-md">
                                    <h4 className="text-[#730051] font-bold text-lg mb-2">Timing</h4>
                                    <p className="text-[#000000]">Sunday Evenings</p>
                                    <p className="text-[#000000] font-medium">6:50pm - 8:50pm</p>
                                </div>
                                <div className="bg-[#ffffff] border border-[#730051]/20 p-6 rounded-lg hover:border-[#730051] transition-colors duration-300 shadow-sm hover:shadow-md">
                                    <h4 className="text-[#730051] font-bold text-lg mb-2">Leadership</h4>
                                    <p className="text-[#000000]">Led by the</p>
                                    <p className="text-[#000000] font-medium">Sister-in-charge</p>
                                </div>
                            </div>
                            <div className="bg-[#ffffff] border border-[#730051]/20 p-6 rounded-lg shadow-sm">
                                <h4 className="text-[#730051] font-bold text-lg mb-4 uppercase tracking-wider">Program Structure</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Weekly Bible study and prayer sessions</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Women's mentorship and encouragement</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Community outreach and charity initiatives</span>
                                    </li>
                                    <li className="flex items-start text-[#000000]">
                                        <span className="mr-3 text-[#730051] font-bold">•</span>
                                        <span>Fellowship gatherings and special events</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="w-full lg:w-5/12 pb-24">
                            <div className="relative group">
                                <div className="absolute -inset-4 border-2 border-[#730051] rounded-2xl opacity-20 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                    <img
                                        src={sistersImg}
                                        alt="Sisters Fellowship Gathering"
                                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#730051] bg-opacity-90 p-4 text-white">
                                        <p className="font-medium text-center">Grace and Strength</p>
                                        <p className="text-sm text-center italic mt-2 text-white/90"> “She is clothed with strength and dignity; she can laugh at the days to come.” - Proverbs 31:25</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SistersFellowship;