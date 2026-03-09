import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Key } from 'lucide-react';
import confetti from 'canvas-confetti';

function TypewriterText({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
    const characters = Array.from(text);

    const container = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delay }
        }
    };

    const child = {
        visible: { opacity: 1, display: "inline-block" },
        hidden: { opacity: 0, display: "none" }
    };

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {characters.map((char, index) => (
                <motion.span variants={child} key={index}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-[4px] h-[0.9em] bg-current align-middle ml-2 opacity-70"
                style={{ borderRadius: "2px" }}
            />
        </motion.span>
    );
}

// Stages of the opening sequence
type Stage = 'box-closed' | 'unlocking' | 'box-opened' | 'envelope-opened';

export function Hero() {
    const [stage, setStage] = useState<Stage>('box-closed');
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            try {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API not supported", e);
            }
        }
        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    const playClickSound = (freq = 400, type: OscillatorType = 'square', duration = 0.05, vol = 1, delaySec = 0) => {
        if (!audioCtxRef.current) return;
        try {
            const ctx = audioCtxRef.current;
            const startTime = ctx.currentTime + delaySec;

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(freq, startTime);

            // Create a fast mechanical decay envelope
            gainNode.gain.setValueAtTime(vol, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        } catch (e) {
            // Ignore if blocked
        }
    };

    const handleBoxClick = () => {
        if (stage !== 'box-closed') return;
        initAudio(); // Initialize and resume context on trusted click!
        setStage('unlocking');

        // Schedule sound sequence perfectly bound to audio context time
        playClickSound(300, 'sawtooth', 0.1, 0.5, 0.5);   // Key slides in
        playClickSound(600, 'square', 0.05, 0.8, 2.0);    // Key turning tick 1
        playClickSound(650, 'square', 0.05, 0.8, 2.6);    // Key turning tick 2
        playClickSound(750, 'square', 0.05, 0.8, 3.2);    // Key turning tick 3
        playClickSound(150, 'sawtooth', 0.4, 1.5, 3.8);   // Final Heavy Metal Latch clunk

        // Wait for key exact animation rotation to finish, then open box
        setTimeout(() => {
            setStage('box-opened');
        }, 4200);
    };

    const handleEnvelopeClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering box click if any
        if (stage !== 'box-opened') return;

        setStage('envelope-opened');

        // Party Popper Blast!
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 8,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#f26d83', '#f88f9f', '#fcf6e5']
            });
            confetti({
                particleCount: 8,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#f26d83', '#f88f9f', '#fcf6e5']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 px-4 py-20 pb-40">

            <AnimatePresence mode="wait">
                {stage !== 'envelope-opened' ? (
                    <motion.div
                        key="treasury-sequence"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center justify-center w-full max-w-lg relative"
                        style={{ perspective: "1500px" }}
                    >

                        {/* ==========================================
                            THE REALISTIC 3D TREASURY BOX 
                        ========================================== */}
                        <div
                            className="relative w-80 h-64 md:w-[450px] md:h-[320px] cursor-pointer group mb-12"
                            onClick={handleBoxClick}
                            style={{ transformStyle: 'preserve-3d' }}
                        >

                            {/* BASE/INSIDE OF THE BOX (Reveals when lid lifts) */}
                            <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[#1a100b] rounded-md shadow-inner overflow-hidden flex justify-center items-center"
                                style={{ transform: "translateZ(-40px)" }}
                            >
                                {/* Interior Depth Shadow */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

                                {/* Gold coins/treasures illusion inside the base */}
                                <div className="absolute bottom-4 w-full h-1/2 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-yellow-600/50 blur-[2px]" />
                            </div>

                            {/* 
                              The Envelope (Pops up straight, STAYS INSIDE the box base)
                            */}
                            <AnimatePresence>
                                {(stage === 'box-opened') && (
                                    <>
                                        {/* Envelope Shadow on the floor of the box */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 0.6, scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-48 h-12 bg-black/60 rounded-[100%] blur-xl z-20 pointer-events-none"
                                        />

                                        <motion.div
                                            initial={{ y: 60, opacity: 0, scale: 0.8 }}
                                            animate={{ y: -50, opacity: 1, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                                            className="absolute top-1/2 left-1/2 origin-center cursor-pointer hover:scale-105 transition-transform drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] z-50"
                                            style={{ transform: "translate(-50%, -50%)" }}
                                            onClick={handleEnvelopeClick}
                                        >
                                            <div className="relative w-64 h-40 md:w-80 md:h-52 bg-[#f26d83] rounded-md flex items-center justify-center overflow-visible shadow-lg border border-white/10">
                                                {/* Envelope Flap (Closed) */}
                                                <div
                                                    className="absolute top-0 left-0 w-full h-1/2 bg-[#de5c72] origin-top shadow-md"
                                                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', zIndex: 10 }}
                                                />
                                                {/* Envelope Body */}
                                                <div
                                                    className="absolute inset-0 bg-[#f88f9f] rounded-md shadow-md"
                                                    style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 50%, 0 0)', zIndex: 5 }}
                                                />
                                                {/* Wax Seal */}
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                                    className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-14 h-14 bg-red-600 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-red-800"
                                                >
                                                    <Heart className="w-6 h-6 text-white text-opacity-90 fill-white" />
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>


                            {/* FRONT BASE PANEL (The stationary bottom half of the chest) */}
                            <div className="absolute bottom-0 left-0 w-full h-[60%] rounded-b-lg shadow-2xl overflow-hidden z-20 flex flex-col justify-end"
                                style={{
                                    background: "linear-gradient(to bottom, #4a2d18 0%, #3e2110 50%, #2b1509 100%)",
                                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.7)"
                                }}
                            >
                                {/* Vertical Planks */}
                                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                                <div className="w-full h-full flex justify-between px-[10%] opacity-30">
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                </div>

                                {/* Deep Iron Bands - Horizontal */}
                                <div className="absolute top-[20%] w-full h-4 bg-gradient-to-b from-[#333] via-[#1a1a1a] to-[#000] border-y border-[#4a4a4a]" />
                                <div className="absolute bottom-[20%] w-full h-4 bg-gradient-to-b from-[#333] via-[#1a1a1a] to-[#000] border-y border-[#4a4a4a]" />

                                {/* Deep Brass Brackets - Corners */}
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[8px] border-l-[8px] border-[#a8823a] rounded-bl-lg shadow-inner z-10" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[8px] border-r-[8px] border-[#a8823a] rounded-br-lg shadow-inner z-10" />

                                {/* Complex Brass Keyhole Plate */}
                                <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-20 h-28 bg-gradient-to-b from-[#d4af37] via-[#b8860b] to-[#8b6508] rounded-b-[40px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-30 border-2 border-[#5c4308] border-t-0 flex flex-col items-center justify-center">

                                    {/* Screws */}
                                    <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-[#5c4308] shadow-inner" />
                                    <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#5c4308] shadow-inner" />

                                    {/* The Hole (Dark Abyss) */}
                                    <div className="w-4 h-4 rounded-full bg-black absolute top-10 shadow-[inset_0_2px_5px_rgba(255,255,255,0.2)]" />
                                    <div className="w-3 h-8 bg-black absolute top-12" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />

                                    {/* GIGA GLOWING ANIMATED KEY */}
                                    <AnimatePresence>
                                        {stage === 'unlocking' && (
                                            <motion.div
                                                // Start large, hovering off-axis, then punch into the keybox
                                                initial={{ opacity: 0, scale: 3, y: 80, x: 50, rotateZ: -60 }}
                                                animate={{ opacity: 1, scale: 1, y: 14, x: 0, rotateZ: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                                                className="absolute top-0 z-[100] drop-shadow-[0_0_20px_rgba(255,215,0,1)] flex items-center justify-center"
                                            >
                                                <motion.div
                                                    // Turn slowly exactly 90 degrees precisely timed with sounds
                                                    animate={{ rotateZ: 90 }}
                                                    transition={{ delay: 2, duration: 1.5, ease: "easeInOut" }}
                                                    style={{ originY: "top", originX: "center" }} // Rotate around the teeth inside the hole
                                                    className="relative"
                                                >
                                                    <Key className="w-16 h-16 text-[#fff5cc] drop-shadow-xl" strokeWidth={1.5} />
                                                    {/* Sparkles on the key handle */}
                                                    <motion.div
                                                        animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                        className="absolute -top-4 -left-4"
                                                    >
                                                        <Sparkles className="w-6 h-6 text-yellow-300" />
                                                    </motion.div>
                                                </motion.div>

                                                {/* Unlock burst particle effect */}
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: [0, 1, 0], scale: [0.5, 3, 4] }}
                                                    transition={{ delay: 3.5, duration: 0.8 }}
                                                    className="absolute"
                                                >
                                                    <div className="w-24 h-24 rounded-full bg-[radial-gradient(circle,_rgba(255,215,0,0.8)_0%,_transparent_70%)] blur-md mix-blend-screen" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* LID FRONT PANEL (Slides UP) */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-[40%] rounded-t-[30px] shadow-2xl overflow-visible z-30"
                                style={{
                                    background: "linear-gradient(to top, #5c3a21 0%, #4a2814 50%, #3e1b0c 100%)",
                                }}
                                // Lid slides straight upward cleanly, no 3D rotation
                                animate={{ y: stage === 'box-opened' ? -140 : 0 }}
                                transition={{ duration: 1.5, type: "spring", bounce: 0.15 }}
                            >
                                {/* Side Lift Chains (Visual realism) */}
                                <div className="absolute -left-4 top-1/2 w-4 h-32 bg-[#222] border-x border-white/5 rounded-full z-[-1]" />
                                <div className="absolute -right-4 top-1/2 w-4 h-32 bg-[#222] border-x border-white/5 rounded-full z-[-1]" />

                                {/* Vertical Planks */}
                                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] rounded-t-[30px]" />
                                <div className="w-full h-full flex justify-between px-[10%] opacity-30">
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                    <div className="w-px h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.1)]" />
                                </div>

                                {/* Deep Iron Bands - Curved Top */}
                                <div className="absolute top-[20%] w-full h-4 bg-gradient-to-b from-[#333] via-[#1a1a1a] to-[#000] border-y border-[#4a4a4a]" />

                                {/* Deep Brass Brackets - Top Corners */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-[8px] border-l-[8px] border-[#a8823a] rounded-tl-[30px] shadow-inner z-10" />
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-[8px] border-r-[8px] border-[#a8823a] rounded-tr-[30px] shadow-inner z-10" />

                                {/* Lid's Upper Latch (Matches with the keyhole) */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-[#c09121] to-[#8b6508] border-2 border-b-0 border-[#5c4308] rounded-t-md shadow-md z-40" />
                            </motion.div>

                        </div>

                        {/* Helper Text below box */}
                        <motion.div
                            className="h-8 flex items-center justify-center w-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {stage === 'box-closed' && (
                                <p className="font-sans font-medium text-[#fcf6e5] opacity-80 tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
                                    <Sparkles className="w-4 h-4 text-[#f26d83]" /> Tap to Unlock Treasury
                                </p>
                            )}
                            {stage === 'unlocking' && (
                                <p className="font-sans font-medium text-[#f26d83] tracking-widest uppercase flex items-center gap-2 drop-shadow-lg font-bold">
                                    Unlocking... <span className="animate-pulse">⏳</span>
                                </p>
                            )}
                            {stage === 'box-opened' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="font-sans font-bold text-[#f26d83] tracking-widest uppercase flex items-center gap-2 bg-[#fcf6e5] px-6 py-2 rounded-full shadow-lg"
                                >
                                    <Heart className="w-4 h-4 fill-current" /> Open the Letter
                                </motion.p>
                            )}
                        </motion.div>

                    </motion.div>
                ) : (
                    // ==========================================
                    //  STAGE 3: LETTER OPENED & CONFETTI
                    // ==========================================
                    <motion.div
                        key="letter"
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="text-center px-4 w-full flex flex-col items-center justify-center max-w-4xl mx-auto"
                    >
                        {/* The greeting text */}
                        <motion.div className="font-bold mb-8 text-[#3a2e2f] flex flex-col items-center justify-center gap-2 md:gap-4 relative w-full">
                            <h1 className="flex flex-col items-center">
                                <span className="font-sans text-3xl md:text-5xl lg:text-6xl text-center mb-6">
                                    <TypewriterText text="Happy Birthday," delay={1.5} />
                                </span>
                                <span className="font-scribble text-7xl md:text-9xl lg:text-[11rem] text-[#f26d83] transform -rotate-3 leading-none drop-shadow-sm text-center w-full block">
                                    <TypewriterText text="Baby! 🎂✨" delay={2.8} />
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4.8, duration: 1 }}
                            className="text-xl md:text-2xl opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed text-center"
                        >
                            Today is all about celebrating you and the joy you bring to  life. Every moment with you is a memory worth treasuring.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 5.4, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-[#f26d83] text-white rounded-full font-semibold text-lg shadow-xl shadow-[#f26d83]/20 hover:shadow-[#f26d83]/40 transition-shadow flex items-center justify-center gap-2 mx-auto cursor-pointer"
                            onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Scroll to Begin <span className="text-xl">✨</span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
