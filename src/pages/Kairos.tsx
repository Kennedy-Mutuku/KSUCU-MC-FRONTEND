import kairosBanner from '../assets/kairos_banner.png';

const Kairos = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="text-center mb-12 pt-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#730051] mb-6">
                        Kairos Course Training
                    </h1>
                    <p className="text-xl text-[#000000] max-w-3xl mx-auto opacity-80 font-light">
                        God's Global Mission & Your Worldview
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
                    {/* Image */}
                    <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-[#730051]/10 group">
                        <img
                            src={kairosBanner}
                            alt="Kairos Course Banner"
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Intro Text */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 border-l-4 border-[#730051] shadow-sm">
                            <h2 className="text-2xl font-bold text-[#730051] mb-4">
                                What is Kairos?
                            </h2>
                            <p className="text-lg leading-relaxed text-[#000000]">
                                The Kairos Course is a nine-session, interactive course designed to educate, inspire, and challenge Christians to active and meaningful participation in God's global mission.
                                It is more than just a course; it is a movement that has mobilized thousands of believers worldwide to align their lives with God's heart for the nations.
                            </p>
                        </div>

                        <p className="text-lg leading-relaxed text-[#000000]">
                            Through biblical, historical, strategic, and cultural dimensions of mission, Kairos provides a comprehensive understanding of the Great Commission. It helps you understand God's eternal purpose and how you fit into it.
                        </p>

                        <div className="bg-[#730051]/5 p-6 rounded-lg border border-[#730051]/10">
                            <h4 className="text-[#730051] font-bold text-lg mb-2">Key Focus</h4>
                            <p className="text-[#000000]">
                                Discipleship • Mission • Cultural Engagement • Strategic Prayer
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-[#ffffff] p-8 rounded-xl border border-[#730051]/20 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300">
                        <h3 className="text-xl font-bold text-[#730051] mb-4">Biblical Foundation</h3>
                        <p className="text-[#000000]">
                            Discover God's heart for all peoples from Genesis to Revelation and see how mission is central to the Bible's narrative.
                        </p>
                    </div>
                    <div className="bg-[#ffffff] p-8 rounded-xl border border-[#730051]/20 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300">
                        <h3 className="text-xl font-bold text-[#730051] mb-4">Historical Perspective</h3>
                        <p className="text-[#000000]">
                            Trace the advance of the Gospel throughout history and learn from the successes and failures of the missions movement.
                        </p>
                    </div>
                    <div className="bg-[#ffffff] p-8 rounded-xl border border-[#730051]/20 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300">
                        <h3 className="text-xl font-bold text-[#730051] mb-4">Strategic & Cultural</h3>
                        <p className="text-[#000000]">
                            Explore current global mission strategies and learn how to cross cultural barriers to share the love of Christ effectively.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-[#730051] text-white rounded-2xl p-10 text-center shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Ready to Expand Your Worldview?</h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                            Join the next Kairos cohort and discover your part in God's plan for the world.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Kairos;
