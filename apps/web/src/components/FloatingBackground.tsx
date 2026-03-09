import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const phrases = [
    "Happy Birthday", "Feliz Cumpleaños", "Joyeux Anniversaire",
    "Alles Gute zum Geburtstag", "Buon Compleanno", "С Днем Рождения",
    "誕生日おめでとう", "생일 축하해요", "Selamat Ulang Tahun",
    "जन्मदिन की शुभकामनाएं", "Gelukkige Verjaardag", "Tillykke med fødselsdagen",
    "Grattis på födelsedagen", "Wszystkiego Najlepszego", "Doğum Günün Kutlu Olsun"
];

export function FloatingBackground() {
    const [elements, setElements] = useState<Array<{ id: number, phrase: string, x: number, y: number, duration: number, delay: number, rotation: number, scale: number }>>([]);

    useEffect(() => {
        // Generate static positions for the background text elements so they don't cause layout thrashing
        const newElements = [];
        for (let i = 0; i < 40; i++) {
            newElements.push({
                id: i,
                phrase: phrases[Math.floor(Math.random() * phrases.length)],
                x: Math.random() * 100, // percentage
                y: Math.random() * 100, // percentage
                duration: 15 + Math.random() * 20,
                delay: Math.random() * 5,
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 1.5,
            });
        }
        setElements(newElements);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fcf6e5]">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="absolute whitespace-nowrap font-scribble text-[#f26d83] opacity-[0.04]"
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        fontSize: `${el.scale * 3}rem`,
                    }}
                    initial={{ rotate: el.rotation, y: 0, opacity: 0 }}
                    animate={{
                        rotate: el.rotation + 20, // Slow rotation
                        y: [-20, 20, -20], // Slow bobbing
                        opacity: [0.03, 0.08, 0.03] // Slow pulsing
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        ease: "linear",
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
