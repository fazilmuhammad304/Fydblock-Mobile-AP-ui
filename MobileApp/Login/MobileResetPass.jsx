import React, { useState } from 'react';
import {
    ArrowLeft, AlertCircle, CheckCircle, Mail, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

const MobileResetPass = () => {
    const navigate = useNavigate();

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // Success state implies email sent

    // Form State
    const [email, setEmail] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) return;

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Reset Error:', error);
            setError('Check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050B0D] text-white font-sans flex flex-col relative overflow-hidden animate-in fade-in duration-500">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[50vh] bg-[#00FF9D]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="p-6 flex items-center justify-between z-10">
                <button onClick={() => navigate('/mobile/login')} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-center px-6 pb-24 z-10 max-w-md mx-auto w-full">

                {/* Title Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-3">Forgot Password?</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                        {!success
                            ? "Enter your email address and we'll send you instructions to reset your password."
                            : "We've sent password reset instructions to your email address."}
                    </p>
                </div>

                {!success ? (
                    <>
                        {/* Error Notification */}
                        {error && (
                            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                                <AlertCircle className="text-red-500 shrink-0" size={18} />
                                <p className="text-xs text-red-200 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleReset} className="space-y-6">

                            {/* Email Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FF9D] transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#00FF9D]/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#00FF9D] text-black font-bold text-lg py-4 rounded-xl shadow-[0_4px_20px_rgba(0,255,157,0.2)] hover:shadow-[0_4px_25px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? "Sending..." : "Reset Password"}
                                {!isLoading && <ChevronRight size={20} strokeWidth={3} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-[#00FF9D]/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-[#00FF9D]" size={32} />
                            </div>

                            <button
                                onClick={() => navigate('/mobile/login')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-lg py-4 rounded-xl transition-all"
                            >
                                Back to Login
                            </button>

                            <button
                                onClick={() => window.open('mailto:')}
                                className="w-full text-[#00FF9D] font-medium py-2 hover:underline text-sm"
                            >
                                Open Email App
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileResetPass;
