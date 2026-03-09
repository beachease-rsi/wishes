import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const phrases = [
    "Sreeyoga", "श्रीयोग", "శ్రీయోగ", "ஸ்ரீயோகா",
    "ಶ್ರೀಯೋಗ", "ശ്രീയോഗ", "श्रीयोग", "श्रीयोग",
    "શ્રીયોગ", "ਸ੍ਰੀਯੋਗ", "ଶ୍ରୀଯୋଗ", "শ্ৰীযোগ"
];

export function FloatingBackground() {
    const [elements, setElements] = useState<Array<{ id: number, phrase: string, x: number, y: number, duration: number, delay: number, rotation: number, scale: number }>>([]);

    useEffect(() => {
        const newElements = [];
        for (let i = 0; i < 35; i++) {
            newElements.push({
                id: i,
                phrase: phrases[Math.floor(Math.random() * phrases.length)],
                x: Math.random() * 100,
                y: Math.random() * 100,
                duration: 20 + Math.random() * 30,
                delay: Math.random() * 5,
                rotation: Math.random() * 20 - 10, // Slight rotation for elegance
                scale: 0.8 + Math.random() * 1.2,
            });
        }
        setElements(newElements);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fcf6e5]">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="absolute whitespace-nowrap font-scribble text-[#f26d83]"
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        fontSize: `${el.scale * 4}rem`,
                    }}
                    initial={{ rotate: el.rotation, y: 0, opacity: 0 }}
                    animate={{
                        y: [-25, 25, -25],
                        opacity: [0.08, 0.18, 0.08] // Higher opacity as requested
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: el.delay,
                    }}
                >
                    {el.phrase}
                </motion.div>
            ))}

            {/* Soft overlay gradient to ensure readability of foreground content */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fcf6e5]/40 to-[#fcf6e5] pointer-events-none" />
        </div>
    );
}
