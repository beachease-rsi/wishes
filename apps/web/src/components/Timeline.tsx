import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type TimelineEvent = {
    id: string;
    year: string;
    title: string;
    desc_content: string;
    img_left: string;
    img_right: string;
};

// We'll keep these as fallback in case the database is empty or not connected yet
const fallbackEvents: TimelineEvent[] = [
    {
        id: '1',
        year: "Day 1",
        title: "How it Started",
        desc_content: "That first conversation where we accidentally talked for hours....",
        img_left: "https://i.postimg.cc/500V1zDT/Whats-App-Image-2026-03-09-at-22-13-02.jpg",
        img_right: "https://i.postimg.cc/wT64yzW8/Whats-App-Image-2026-03-09-at-22-24-07.jpg"
    },
    {
        id: '3',
        year: "Memories",
        title: "sweet memories",
        desc_content: "Every moment with you is a good memory",
        img_left: "https://i.postimg.cc/9XTzR5DR/Whats-App-Image-2026-03-09-at-22-18-27.jpg",
        img_right: "https://i.postimg.cc/wMxPpYPc/Whats-App-Image-2026-03-09-at-22-18-29.jpg"
    },
    {
        id: '2',
        year: "Adventures",
        title: "Getting Lost Together",
        desc_content: "Every wrong turn somehow led to the best memories. Here's to all our spontaneous trips.",
        img_left: "https://i.postimg.cc/k5Ftt01b/Whats-App-Image-2026-03-09-at-22-20-49-(1).jpg",
        img_right: "https://i.postimg.cc/GmXWhtr9/Whats-App-Image-2026-03-09-at-22-20-49.jpg"
    },

    {
        id: '4',
        year: "Vibes",
        title: "Good Vibes",
        desc_content: "Every wrong turn somehow led to the best memories.",
        img_left: "https://i.postimg.cc/bv7pprHL/Whats-App-Image-2026-03-09-at-22-18-28.jpg",
        img_right: "https://i.postimg.cc/nzKbxkL8/Whats-App-Image-2026-03-09-at-22-18-32.jpg"
    },
];



// Semi-random floating hearts background generator
function FloatingHearts() {
    const [hearts, setHearts] = useState<{ id: number; left: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate a fixed number of random hearts on mount
        const generatedHearts = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // Random percentage across the screen width
            size: Math.random() * 30 + 10, // Max size 40, Min size 10
            duration: Math.random() * 10 + 15, // Rise takes anywhere from 15 to 25 seconds
            delay: Math.random() * 15 // Stagger the start times randomly
        }));
        setHearts(generatedHearts);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
            {hearts.map((h) => (
                <motion.div
                    key={h.id}
                    className="absolute bottom-[-50px]"
                    style={{ left: `${h.left}%` }}
                    animate={{
                        y: [0, -window.innerHeight - 100], // Float up past the screen
                        x: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, 0], // Slight swaying back and forth
                        rotate: [0, Math.random() * 360],
                        opacity: [0, 0.4, 0.4, 0] // Fade in, stay visible, fade out near top
                    }}
                    transition={{
                        duration: h.duration,
                        delay: h.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Heart
                        className="text-[#f26d83] fill-[#f26d83] opacity-30"
                        style={{ width: `${h.size}px`, height: `${h.size}px` }}
                    />
                </motion.div>
            ))}
        </div>
    );
}

// Reusable component for the hanging elements (both Note and Polaroids)
function HangingElement({ children, rotate = 0, delay = 0, isNote = false, topOffset = "mt-0", stringHeight = "h-12" }: { children: React.ReactNode, rotate?: number, delay?: number, isNote?: boolean, topOffset?: string, stringHeight?: string }) {
    return (
        <motion.div
            initial={{ rotate: 0, y: -20, opacity: 0 }}
            animate={{ rotate: rotate, y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay }}
            className={`relative flex flex-col items-center justify-start ${isNote ? 'w-full md:w-[35%] z-30' : 'hidden md:flex md:w-[25%] z-20'} ${topOffset}`}
        >
            {/* Hanging String reaching UP to the wave rope */}
            {/* We use a negative margin top to deliberately pull the string up BEHIND the prominent SVG rope so it correctly connects visually! */}
            <div className={`w-1 ${stringHeight} bg-[#dcd2c6] shadow-md flex-shrink-0 blur-[0.5px] opacity-90 -mt-8`} style={{ background: 'linear-gradient(90deg, #e3dacd, #6e5846)' }} />

            {/* Realistic Wooden Clip with Steel Pin */}
            <div className="relative z-20 flex flex-col items-center drop-shadow-md -mt-3">
                {/* Steel Curl Pin ring attached to the top of the clip */}
                <div className="w-6 h-6 border-2 border-[#a39d9d] rounded-full absolute -top-5 -z-10 bg-transparent flex items-start justify-center">
                    <div className="w-1 h-3 bg-[#a39d9d] rounded-t-sm" />
                </div>
                {/* Wooden Clip Body */}
                <div className="w-3.5 h-10 bg-[#c2a38b] rounded-sm shadow-inner overflow-hidden border border-[#8b6f58]">
                    {/* Wood Grain Lines */}
                    <div className="w-full h-[1px] bg-[#8b6f58]/30 mt-2" />
                    <div className="w-full h-[1px] bg-[#8b6f58]/30 mt-3" />
                    <div className="w-full h-[1px] bg-[#8b6f58]/30 mt-2" />
                </div>
                {/* Steel Spring on the clip */}
                <div className="w-4 h-2.5 bg-[#5d4a4d] -mt-5 rounded-full shadow-lg border border-[#3a2e2f]" />
            </div>

            {/* Content Container (Card/Photo) with slight swing animation attached to the clip */}
            <motion.div
                animate={{ rotate: [rotate, rotate + 1.5, rotate - 1, rotate] }}
                transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: Math.random() * 2 }}
                style={{ transformOrigin: "top center" }}
                className="-mt-1 w-full flex justify-center"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

export function Timeline() {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [vwPixels, setVwPixels] = useState(1000);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('journey_events')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    setEvents(data);
                } else {
                    setEvents(fallbackEvents);
                }
            } catch (err) {
                console.error('Error fetching journey events:', err);
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const infiniteEvents = events.length > 0 ? Array(Math.max(1, Math.ceil(15 / events.length))).fill(events).flat() : [];

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            setVwPixels(window.innerWidth);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (infiniteEvents.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % infiniteEvents.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [infiniteEvents.length]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#3a2e2f]">
                <Loader2 className="w-12 h-12 text-[#f26d83] animate-spin" />
            </div>
        );
    }

    const cardWidthVW = isMobile ? 100 : 80;
    const centerOffset = `calc(50vw - ${activeIndex * cardWidthVW}vw - ${cardWidthVW / 2}vw)`;

    const cardPixelWidth = (cardWidthVW / 100) * vwPixels;

    const sinewavePath = infiniteEvents.map((_, i) => {
        const startX = i * cardPixelWidth;
        const midX = startX + (cardPixelWidth / 2);
        const endX = startX + cardPixelWidth;
        return `M ${startX},30 Q ${midX},280 ${endX},30`;
    }).join(" ");


    return (
        <section className="h-[95vh] md:h-screen w-full overflow-hidden bg-[#3a2e2f] text-[#fcf6e5] relative flex flex-col justify-center py-12">
            <style>
                {`
          @keyframes flowRope {
            from { stroke-dashoffset: 40; }
            to { stroke-dashoffset: 0; }
          }
          .animate-flow-rope {
            animation: flowRope 0.6s linear infinite;
          }
        `}
            </style>

            {/* Floating Background Effects */}
            <FloatingHearts />

            {/* Floating Heading */}
            <div className="absolute top-4 left-4 md:top-12 md:left-12 z-50 pointer-events-none drop-shadow-xl">
                <h2 className="text-3xl md:text-5xl font-sans font-bold flex flex-col">
                    <span>The</span>
                    <span className="font-scribble text-[#f26d83] text-6xl md:text-8xl mt-1 transform -rotate-3">Journey</span>
                </h2>
            </div>

            {/* Fade edges to obscure incoming/outgoing cards perfectly */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-56 bg-gradient-to-r from-[#3a2e2f] via-[#3a2e2f]/90 to-transparent z-40 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-56 bg-gradient-to-l from-[#3a2e2f] via-[#3a2e2f]/90 to-transparent z-40 pointer-events-none" />


            {/* Main Timeline Sliding Track */}
            <div className="w-full flex items-center relative z-10 h-full mt-16 md:mt-24">
                <motion.div
                    className="flex items-start w-max h-full relative"
                    animate={{ x: centerOffset }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                >

                    {/* THE SEAMLESS EXPLICIT SINE WAVE ROPE (No Pattern) */}
                    {/* Extremely high Z-index so the rope overlaps the strings attached to the elements below it */}
                    <div className="absolute top-0 left-0 w-full h-[300px] z-[60] pointer-events-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] overflow-visible">
                        <svg
                            width={`${infiniteEvents.length * cardPixelWidth}px`}
                            height="300px"
                            viewBox={`0 0 ${infiniteEvents.length * cardPixelWidth} 300`}
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        >
                            {/* 
                  Continuous explicit sine wave path across the entire huge SVG width. 
               */}
                            <path
                                d={sinewavePath}
                                stroke="#3e2d23" strokeWidth="26" fill="none" strokeLinecap="round"
                            />
                            <path
                                d={sinewavePath}
                                stroke="#8b6f58" strokeWidth="20" fill="none" strokeLinecap="round"
                            />
                            <path
                                d={sinewavePath}
                                stroke="#dcd2c6"
                                strokeWidth="6"
                                strokeDasharray="20 20"
                                fill="none"
                                strokeLinecap="round"
                                opacity="0.85"
                                className="animate-flow-rope"
                            />
                            <path
                                d={sinewavePath}
                                stroke="#5c4433"
                                strokeWidth="4"
                                strokeDasharray="15 25"
                                fill="none"
                                strokeLinecap="round"
                                opacity="0.6"
                                className="animate-flow-rope"
                                style={{ animationDirection: 'reverse' }}
                            />
                        </svg>
                    </div>


                    {infiniteEvents.map((event, i) => {
                        const isCenter = i === activeIndex;
                        return (
                            <div
                                key={i}
                                className={`${isMobile ? 'w-[100vw]' : 'w-[80vw]'} h-full flex-shrink-0 flex flex-col items-center justify-start p-2 md:p-8 relative z-10`}
                            >
                                {/* 
                   The Main Content Container for each Slide
                */}
                                <div className="w-full max-w-7xl relative flex flex-col items-center mt-12 md:mt-16 h-full">

                                    {/* Year Heading Above the Rope dipping center */}
                                    <motion.h3
                                        animate={{ scale: isCenter ? 1 : 0.8 }}
                                        className="absolute -top-[10px] md:-top-[25px] font-scribble text-5xl md:text-7xl text-[#f26d83] transform -rotate-2 drop-shadow-md text-center z-50 pointer-events-none"
                                    >
                                        {event.year}
                                    </motion.h3>

                                    {/* Hanging Elements Wrapper with justified wide spacing */}
                                    <div className="flex w-full justify-between items-start mt-0 px-2 md:px-12 relative z-10 transition-all duration-[1.2s]"
                                        style={{
                                            opacity: isCenter ? 1 : 0.25,
                                            transform: isCenter ? 'scale(1)' : 'scale(0.85)',
                                            filter: isCenter ? 'blur(0px)' : 'blur(5px)'
                                        }}
                                    >

                                        {/* Left Polaroid - Connects high up near the start of the sagging wave */}
                                        <HangingElement
                                            rotate={-4}
                                            delay={0.1}
                                            topOffset="mt-[70px] md:mt-[90px]"
                                            stringHeight="h-[40px]"
                                        >
                                            {/* Polaroid with Punched Holes on Top */}
                                            <div className="bg-[#fcf6e5] p-2 pt-6 pb-10 md:p-4 md:pt-8 md:pb-16 rounded-sm shadow-[0_15px_30px_rgba(0,0,0,0.4)] w-[160px] h-[200px] md:w-[280px] md:h-[350px] relative">
                                                {/* Punched Holes rendering realistically */}
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#3a2e2f] rounded-full shadow-inner opacity-80" />
                                                <div className="absolute top-2 left-[20%] w-3 h-3 md:w-4 md:h-4 bg-[#3a2e2f] rounded-full shadow-inner opacity-80" />
                                                <div className="absolute top-2 right-[20%] w-3 h-3 md:w-4 md:h-4 bg-[#3a2e2f] rounded-full shadow-inner opacity-80" />

                                                <div className="w-full h-full overflow-hidden bg-[#e8dbce] mt-2 border border-black/5">
                                                    <img src={event.img_left} alt="Memory Left" className="w-full h-full object-cover sepia-[0.1]" />
                                                </div>
                                            </div>
                                        </HangingElement>

                                        {/* Center Note - Drops deeply to perfectly connect to the lowest Y=155 point of the drooping sine wave */}
                                        <HangingElement
                                            rotate={1}
                                            delay={0.2}
                                            isNote={true}
                                            topOffset="mt-[165px]"
                                            stringHeight="h-[60px]"
                                        >
                                            <div className="bg-[#fcf6e5]/90 backdrop-blur-md p-6 md:p-12 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-center w-full relative before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] before:opacity-20 before:pointer-events-none">
                                                <h4 className="text-2xl md:text-4xl font-sans font-bold mb-6 text-[#3a2e2f] text-center">{event.title}</h4>
                                                <p className="text-lg md:text-2xl text-[#3a2e2f] text-center opacity-85 leading-relaxed font-sans font-medium">
                                                    {event.desc_content}
                                                </p>
                                            </div>
                                        </HangingElement>

                                        {/* Right Polaroid - Connects high up similarly to the Left Polaroid */}
                                        <HangingElement
                                            rotate={3}
                                            delay={0.3}
                                            topOffset="mt-[70px] md:mt-[90px]"
                                            stringHeight="h-[40px]"
                                        >
                                            {/* Polaroid with Punched Holes on Top */}
                                            <div className="bg-[#fcf6e5] p-2 pt-6 pb-10 md:p-4 md:pt-8 md:pb-16 rounded-sm shadow-[0_15px_30px_rgba(0,0,0,0.4)] w-[160px] h-[200px] md:w-[280px] md:h-[350px] relative">
                                                {/* Punched Holes rendering realistically */}
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#3a2e2f] rounded-full shadow-inner opacity-80" />
                                                <div className="absolute top-2 left-[20%] w-3 h-3 md:w-4 md:h-4 bg-[#3a2e2f] rounded-full shadow-inner opacity-80" />
                                                <div className="absolute top-2 right-[20%] w-3 h-3 md:w-4 md:h-4 bg-[#3a2e2f] rounded-full shadow-inner opacity-80" />

                                                <div className="w-full h-full overflow-hidden bg-[#e8dbce] mt-2 border border-black/5">
                                                    <img src={event.img_right} alt="Memory Right" className="w-full h-full object-cover sepia-[0.1]" />
                                                </div>
                                            </div>
                                        </HangingElement>

                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    );
}
