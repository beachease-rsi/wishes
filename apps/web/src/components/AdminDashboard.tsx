import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Image as ImageIcon, BookOpen, Check, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

type Section = 'journey' | 'memory';

export function AdminDashboard() {
    const [section, setSection] = useState<Section>('journey');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [year, setYear] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file || !text) return;
        setLoading(true);

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${section}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            // 2. Insert into Database
            if (section === 'journey') {
                const { error: dbError } = await supabase
                    .from('journey_events')
                    .insert([{
                        year: year || '2024',
                        title: title || 'New Memory',
                        desc_content: text,
                        img_left: publicUrl, // Defaulting to left for simplicity
                        img_right: publicUrl,
                        display_order: Date.now()
                    }]);
                if (dbError) throw dbError;
            } else {
                const { error: dbError } = await supabase
                    .from('memories')
                    .insert([{
                        img_url: publicUrl,
                        message: text,
                        display_order: Date.now()
                    }]);
                if (dbError) throw dbError;
            }

            setSuccess(true);
            setFile(null);
            setPreview(null);
            setText('');
            setYear('');
            setTitle('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Something went wrong. check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#3a2e2f] text-[#fcf6e5] font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <Link to="/" className="text-[#f26d83] flex items-center gap-2 mb-2 hover:underline">
                            <ArrowLeft className="w-4 h-4" /> Back to Site
                        </Link>
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <p className="opacity-70 mt-2">Upload new photos and descriptions instantly.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Selection */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setSection('journey')}
                            className={`p-6 rounded-2xl flex items-center gap-4 transition-all ${section === 'journey' ? 'bg-[#f26d83] text-white shadow-xl' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                            <BookOpen className="w-6 h-6" />
                            <div className="text-left">
                                <span className="block font-bold">The Journey</span>
                                <span className="text-sm opacity-70">Timeline events</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setSection('memory')}
                            className={`p-6 rounded-2xl flex items-center gap-4 transition-all ${section === 'memory' ? 'bg-[#f26d83] text-white shadow-xl' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                            <ImageIcon className="w-6 h-6" />
                            <div className="text-left">
                                <span className="block font-bold">Our Moments</span>
                                <span className="text-sm opacity-70">Photo grid cards</span>
                            </div>
                        </button>
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-2 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        {success && (
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50 shadow-lg"
                            >
                                <Check className="w-4 h-4" /> Success! Site Updated.
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            {/* Image Picker */}
                            <div>
                                <label className="block text-sm font-medium opacity-70 mb-2">Photo</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${preview ? 'border-transparent' : 'border-white/20 group-hover:border-[#f26d83]'}`}>
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 opacity-40 mb-2" />
                                                <span className="opacity-50">Select or drag photo</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {section === 'journey' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium opacity-70 mb-2">Year/Label</label>
                                        <input
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            placeholder="e.g. 2024 or Day 1"
                                            className="w-full bg-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f26d83]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium opacity-70 mb-2">Event Title</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="What happened?"
                                            className="w-full bg-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f26d83]"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium opacity-70 mb-2">
                                    {section === 'journey' ? 'Description' : 'Message on Photo'}
                                </label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={section === 'journey' ? 'Describe the memory...' : 'Write a sweet note...'}
                                    className="w-full h-32 bg-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f26d83] resize-none"
                                />
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={loading || !file || !text}
                                className="w-full py-4 bg-[#f26d83] hover:bg-[#ff8fa1] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#f26d83]/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Suapbase...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" /> Add to {section === 'journey' ? 'Journey' : 'Memories'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
