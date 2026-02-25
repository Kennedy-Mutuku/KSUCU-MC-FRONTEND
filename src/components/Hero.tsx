import { useState, useEffect } from 'react';
import { PlayCircle, Sparkles } from 'lucide-react';

const verses = [
    {
        reference: "Romans 12:2",
        text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind."
    },
    {
        reference: "Philippians 2:5",
        text: "Let this mind be in you which was also in Christ Jesus."
    },
    {
        reference: "I Corinthians 2:16",
        text: "'For “who has known the mind of the Lord that he may instruct Him?” But we have the mind of Christ.'"
    }
];

const Hero = () => {
    const [currentVerse, setCurrentVerse] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentVerse((prev) => (prev + 1) % verses.length);
                setFade(true);
            }, 500); // Wait for fade out before switching
        }, 5000); // Switch every 5 seconds

        return () => clearInterval(interval);
    }, []);
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#6c0a50]">

            {/* 1. Background Pattern (Subtle & Professional) */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Abstract "Minds" Network Pattern (SVG Overlay) - Kept subtle */}
                <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M0 0 C 50 100 80 100 100 0 Z" fill="none" stroke="white" strokeWidth="0.5" />
                </svg>
            </div>

            {/* 2. Main Content Container */}
            <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Column: Text Content */}
                <div className="text-center lg:text-left text-white space-y-8">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-100 text-sm font-medium">
                        <Sparkles size={16} className="text-yellow-400" />
                        <span>Faith • Intellect • Transformation</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                        <span className="text-white">☆ Christian</span>, <span className="text-white">Minds ☆</span>.
                    </h1>

                    {/* Subtext */}
                    <p className="text-xl text-purple-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Join a vibrant people dedicated to exploring the depths of Christian truth and serving our world with timely and transformative knowledge from the mind of Christ.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                        <button className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white font-semibold">
                            <PlayCircle size={22} />
                            <span>Watch Our Story</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Visual Feature (Glassmorphism Card) */}
                <div className="hidden lg:block relative perspective-1000">
                    <div className="relative z-10 p-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl min-h-[300px] flex flex-col justify-center">
                        <div className={`space-y-6 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-2xl">💡</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Daily Verses</h3>
                                    <p className="text-purple-200 text-sm">{verses[currentVerse].reference}</p>
                                </div>
                            </div>

                            <blockquote className="text-xl text-white/90 italic border-l-4 border-yellow-400/50 pl-6 leading-relaxed">
                                "{verses[currentVerse].text}"
                            </blockquote>

                            <div className="pt-4 flex items-center gap-3 text-sm text-purple-200">
                                <div className="h-px flex-1 bg-white/20"></div>
                                <span>Renew Your Mind</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
