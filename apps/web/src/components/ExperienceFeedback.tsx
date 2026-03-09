import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Heart, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ExperienceFeedback() {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Only show the floating bubble after scrolling a bit or at the bottom
    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
            if (scrolledToBottom) {
                setIsVisible(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim() || isSending) return;

        setIsSending(true);
        try {
            const { error } = await supabase
                .from('feedback')
                .insert([{ content: feedback.trim() }]);

            if (error) throw error;

            setIsSubmitted(true);
            setFeedback("");
            setTimeout(() => {
                setIsOpen(false);
                setIsSubmitted(false);
            }, 3000);
        } catch (err) {
            console.error('Error submitting feedback:', err);
            // Even if it fails, we'll show success for UX or we could show an error
            // For a "wish" site, let's just log and move on to keep it smooth
            setIsSubmitted(true);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative"
                    >
                        {/* The Main Feedback Window */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    className="mb-4 w-[320px] md:w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-[#f26d83]/20"
                                >
                                    <div className="bg-[#f26d83] p-4 flex justify-between items-center text-white">
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-5 h-5 fill-white" />
                                            <span className="font-semibold">How was your experience?</span>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="hover:bg-white/20 p-1 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        {!isSubmitted ? (
                                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                                <p className="text-gray-600 font-sans text-sm">
                                                    I'd love to hear how you felt navigating through these memories!
                                                </p>
                                                <textarea
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                    placeholder="Write your thoughts here..."
                                                    className="w-full h-32 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f26d83] transition-all resize-none font-sans"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isSending}
                                                    className="w-full py-3 bg-[#f26d83] text-white rounded-xl font-bold shadow-lg shadow-[#f26d83]/20 hover:shadow-[#f26d83]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {isSending ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                    {isSending ? 'Sending...' : 'Send Feedback'}
                                                </button>
                                            </form>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="py-8 text-center"
                                            >
                                                <div className="w-16 h-16 bg-[#f26d83]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Heart className="w-8 h-8 text-[#f26d83] fill-[#f26d83]" />
                                                </div>
                                                <h4 className="text-xl font-bold text-[#3a2e2f] mb-2">Thank you!</h4>
                                                <p className="text-gray-500">Your feedback means the world to me.</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Attention-Grabbing Tooltip/Label */}
                        <AnimatePresence>
                            {!isOpen && isVisible && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                                    className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#3a2e2f] text-white px-4 py-2 rounded-2xl whitespace-nowrap shadow-xl flex items-center gap-2 pointer-events-none"
                                >
                                    <span className="font-sans font-bold text-sm italic">Tell me your thoughts! 💭</span>
                                    {/* Small arrow pointing to the button */}
                                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#3a2e2f] border-b-[6px] border-b-transparent" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* The Pulsing Ring Effect (Only when hidden/closed) */}
                        {!isOpen && (
                            <motion.div
                                animate={{
                                    scale: [1, 1.4, 1.6],
                                    opacity: [0.5, 0.2, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 bg-[#f26d83] rounded-full z-[-1]"
                            />
                        )}

                        {/* The Floating Bubble Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative z-10 ${isOpen ? 'bg-[#3a2e2f]' : 'bg-[#f26d83]'
                                }`}
                        >
                            {isOpen ? (
                                <X className="text-white w-8 h-8" />
                            ) : (
                                <MessageSquare className="text-white w-8 h-8" />
                            )}

                            {/* Little notification dot - More aggressive bounce */}
                            {!isOpen && (
                                <motion.span
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[12px] font-black text-[#f26d83] shadow-lg ring-4 ring-[#f26d83] z-20"
                                >
                                    !
                                </motion.span>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
