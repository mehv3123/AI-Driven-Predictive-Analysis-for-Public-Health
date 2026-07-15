import React, { useState } from 'react';
import { Shield, Activity, Thermometer, Wind, CheckCircle, Play, ChevronRight, Sparkles } from 'lucide-react';

const guidelinesData = [
    {
        id: 1,
        category: "General Hygiene",
        description: "Essential practices for daily cleanliness and infection prevention.",
        icon: <Shield className="h-5 w-5" />,
        color: "from-emerald-500 to-teal-400",
        accent: "text-emerald-500",
        accentBg: "bg-emerald-50",
        accentBorder: "border-emerald-100",
        accentCheck: "text-emerald-400",
        number: "01",
        imageUrl: "/General-Hygiene.png",
        videoId: "3PmVJQUCm4E",
        items: ["Hand Sterilization", "Surface Cleaning", "Touch Awareness", "Sanitizer Usage"]
    },
    {
        id: 2,
        category: "Respiratory Safety",
        description: "Protocols to protect airways and minimize airborne transmission.",
        icon: <Wind className="h-5 w-5" />,
        color: "from-blue-500 to-cyan-400",
        accent: "text-blue-500",
        accentBg: "bg-blue-50",
        accentBorder: "border-blue-100",
        accentCheck: "text-blue-400",
        number: "02",
        imageUrl: "/Respiratory-Safety.png",
        videoId: "Tzpz5fko-fg",
        items: ["Mask Protocols", "Cough Etiquette", "Tissue Disposal", "Air Ventilation"]
    },
    {
        id: 3,
        category: "Health Tracking",
        description: "Monitor vital signs and symptoms for early detection and response.",
        icon: <Thermometer className="h-5 w-5" />,
        color: "from-rose-500 to-pink-400",
        accent: "text-rose-500",
        accentBg: "bg-rose-50",
        accentBorder: "border-rose-100",
        accentCheck: "text-rose-400",
        number: "03",
        imageUrl: "/Health-Tracking.png",
        videoId: "_9-eyZ9dZCyOjfPs",
        items: ["Fever Monitoring", "Oxygen Levels", "Self Isolation", "Medical Contact"]
    },
    {
        id: 4,
        category: "Immune Support",
        description: "Strengthen natural defenses through nutrition, rest, and movement.",
        icon: <Activity className="h-5 w-5" />,
        color: "from-violet-500 to-purple-400",
        accent: "text-violet-500",
        accentBg: "bg-violet-50",
        accentBorder: "border-violet-100",
        accentCheck: "text-violet-400",
        number: "04",
        imageUrl: "/Immune-Support.png",
        videoId: "-G75tYoJqi84QalY",
        items: ["Nutrient Density", "Hydration Goals", "Sleep Cycles", "Daily Movement"]
    }
];

const HealthGuidelines = () => {
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-24 px-4">
            <div className="max-w-6xl mx-auto">

                
                <header className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-6">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-600 font-semibold tracking-wide text-xs uppercase">Safety Standard 2026</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-6">
                        Wellness
                        <span className="block bg-gradient-to-r from-blue-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                            Framework.
                        </span>
                    </h1>
                    <p className="max-w-md mx-auto text-slate-400 font-medium text-lg leading-relaxed">
                        A high-performance guide to community health and preventative care.
                    </p>
                </header>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {guidelinesData.map((section) => (
                        <div
                            key={section.id}
                            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:-translate-y-1"
                            onMouseEnter={() => setHoveredId(section.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            
                            <div className="relative aspect-[16/10] overflow-hidden">
                                {playingVideoId === section.id ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${section.videoId}?autoplay=1`}
                                        title={section.category}
                                        allow="autoplay"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div
                                        className="relative h-full w-full cursor-pointer"
                                        onClick={() => setPlayingVideoId(section.id)}
                                    >
                                        <img
                                            src={section.imageUrl}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            alt={section.category}
                                        />

                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                        
                                        <div className="absolute top-4 right-4">
                                            <span className="text-white/20 font-black text-5xl leading-none select-none">
                                                {section.number}
                                            </span>
                                        </div>

                                        
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                            <div className="relative w-16 h-16 bg-white/30 backdrop-blur-md border border-white/40 shadow-none rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                                                <Play className={`h-6 w-6 text-white fill-current ml-0.5`} />
                                            </div>
                                        </div>

                                        
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${section.color} text-white`}>
                                                    {section.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-lg leading-tight">{section.category}</h3>
                                                    <p className="text-white/60 text-xs font-medium mt-0.5">{section.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            
                            <div className="p-5">
                                <div className="grid grid-cols-2 gap-2.5">
                                    {section.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-2.5 p-3 rounded-xl ${section.accentBg} border ${section.accentBorder} transition-all duration-300`}
                                            style={{
                                                transitionDelay: hoveredId === section.id ? `${index * 50}ms` : '0ms',
                                                transform: hoveredId === section.id ? 'translateX(4px)' : 'translateX(0)',
                                            }}
                                        >
                                            <CheckCircle className={`h-4 w-4 ${section.accentCheck} flex-shrink-0`} />
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                
                                <button
                                    onClick={() => setPlayingVideoId(section.id)}
                                    className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${section.color} text-white font-semibold text-sm tracking-wide opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                    Watch Guide
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-6 py-4">
                        <div className="flex -space-x-1">
                            {guidelinesData.map((s) => (
                                <div key={s.id} className={`w-3 h-3 rounded-full bg-gradient-to-br ${s.color} ring-2 ring-white`} />
                            ))}
                        </div>
                        <span className="text-slate-400 text-sm font-medium">
                            4 categories · 16 guidelines · Updated for 2026
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthGuidelines;