
import bestpImg from '../assets/Best-p.png';

const BestpClass = () => {
    return (
        <div className="bg-[#ffffff] min-h-screen text-[#000000] font-sans overflow-hidden">

            <div className="relative">
                <div className="max-w-7xl mx-auto pt-20 pb-24 px-4 md:px-12">
                    {/* Header Section */}
                    <div className="mb-12 border-b-2 border-[#730051]/20 pb-6">
                        <h3 className="text-4xl md:text-5xl font-bold text-[#730051] mb-4">
                            Best-P Classes
                        </h3>
                        <p className="text-xl md:text-2xl font-light text-[#000000] opacity-80 max-w-3xl">
                            Bible Expository Self-Training Program
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Content Section */}
                        <div className="flex-1 space-y-8">
                            <div className="prose prose-lg max-w-none text-[#000000]">
                                <p className="text-lg leading-relaxed">
                                    “BEST-P” is an acronym for <span className="font-semibold text-[#730051]">Bible Expository Self-Training Program</span>.
                                    It is a long term group oriented training program on inductive Bible study, principles of bible interpretation, expository preaching, and apologetics.
                                </p>
                            </div>

                            <div className="bg-[#730051]/5 border-l-4 border-[#730051] p-6 rounded-r-lg space-y-4">
                                <h4 className="text-[#730051] font-bold text-lg uppercase tracking-wider">Program Details</h4>
                                <div className="space-y-3">
                                    <p className="text-[#000000]">
                                        <span className="font-semibold">Schedule:</span> Wednesdays at 6:50pm to 8:50pm
                                    </p>
                                    <p className="text-[#000000]">
                                        <span className="font-semibold">Structure:</span> Starts with a Bible study class, followed by a Bible interpretation class, and then a preaching class.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 text-[#000000]/90">
                                <p className="leading-relaxed">
                                    The Best-P program is a comprehensive training program that focuses on the Bible and its interpretation. It includes practical exercises, group discussions, and guidance from experienced instructors.
                                </p>
                                <p className="leading-relaxed">
                                    Participants in the Best-P classes will learn how to study the Bible effectively, interpret its teachings accurately, and communicate those teachings to others through expository preaching.
                                </p>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="w-full lg:w-5/12">
                            <div className="relative group">
                                <div className="absolute -inset-4 border-2 border-[#730051] rounded-2xl opacity-20 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                    <img
                                        src={bestpImg}
                                        alt="Best-P Classes Session"
                                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#730051] bg-opacity-90 p-4 text-white">
                                        <p className="font-medium text-center">Growing in the Word together</p>
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

export default BestpClass;