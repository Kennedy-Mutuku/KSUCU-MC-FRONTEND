import React from 'react';
import { Shield, Heart, Award } from 'lucide-react';

const ValuesBanner = () => {
    return (
        <section className="bg-[#6c0a50] py-16 text-white relative overflow-hidden">
            {/* Subtle Background Elements - Professional & Clean */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20 text-center">

                    {/* Integrity (Left) -> animate-dance-1 */}
                    <div className="group flex flex-col items-center gap-5 cursor-default md:animate-dance-1">
                        <div className="relative">
                            {/* Subtle Glow on Hover */}
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/50">
                                <Award size={40} className="text-white/90 group-hover:text-white transition-colors duration-300" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-xl font-bold tracking-widest uppercase text-white/90 group-hover:text-white transition-colors">
                                Integrity
                            </h3>
                            {/* Minimalist White Underline */}
                            <div className="w-8 h-0.5 bg-white/50 group-hover:w-full group-hover:bg-white transition-all duration-300"></div>
                        </div>
                    </div>

                    {/* Minimal Divider (Hidden on Desktop to allow movement) */}
                    <div className="block md:hidden w-px h-16 bg-white/10"></div>

                    {/* Purity (Center) -> animate-dance-2 */}
                    <div className="group flex flex-col items-center gap-5 cursor-default md:animate-dance-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/50">
                                <Heart size={40} className="text-white/90 group-hover:text-white transition-colors duration-300" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-xl font-bold tracking-widest uppercase text-white/90 group-hover:text-white transition-colors">
                                Purity
                            </h3>
                            <div className="w-8 h-0.5 bg-white/50 group-hover:w-full group-hover:bg-white transition-all duration-300"></div>
                        </div>
                    </div>

                    {/* Minimal Divider (Hidden on Desktop) */}
                    <div className="block md:hidden w-px h-16 bg-white/10"></div>

                    {/* Chastity (Right) -> animate-dance-3 */}
                    <div className="group flex flex-col items-center gap-5 cursor-default md:animate-dance-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/50">
                                <Shield size={40} className="text-white/90 group-hover:text-white transition-colors duration-300" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-xl font-bold tracking-widest uppercase text-white/90 group-hover:text-white transition-colors">
                                Chastity
                            </h3>
                            <div className="w-8 h-0.5 bg-white/50 group-hover:w-full group-hover:bg-white transition-all duration-300"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ValuesBanner;
