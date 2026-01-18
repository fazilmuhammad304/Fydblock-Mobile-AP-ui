import React, { useState } from 'react';
import {
    ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Lock, Mail, ChevronRight, Check, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { setToken } from '../../utils/token';

const MobileSignup = () => {
    const navigate = useNavigate();

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);

    // Password Validation
    const passwordRules = [
        { label: "8+ chars", test: (p) => p.length >= 8 },
        // { label: "1 lower", test: (p) => /[a-z]/.test(p) }, // Simplified for mobile UI space
        // { label: "1 upper", test: (p) => /[A-Z]/.test(p) },
        // { label: "1 number", test: (p) => /\d/.test(p) },
    ];
    const isPasswordValid = password.length >= 8; // Simplified check for mobile brevity, or use full rules if critical

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!agreed) {
            setError("You must agree to the Terms of Service.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!isPasswordValid) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token, true);
                setSuccess('Account created! Redirecting...');
                setTimeout(() => {
                    navigate('/bot-builder');
                }, 1500);
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            setError('Check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        setError("Google Sign-Up is currently disabled.");
    };

    return (
        <div className="min-h-screen bg-[#050B0D] text-white font-sans flex flex-col relative overflow-hidden animate-in fade-in duration-500">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[50vh] bg-[#00FF9D]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[50vh] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="p-6 flex items-center justify-between z-10">
                <button onClick={() => navigate('/mobile/login')} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-center px-6 pb-12 z-10 max-w-md mx-auto w-full">

                {/* Title Section */}
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-6">
                        <img src="/logo.png" alt="FydBlock" className="w-24 object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-gray-400 text-sm">Join FydBlock and start trading</p>
                </div>

                {/* Notifications */}
                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                        <AlertCircle className="text-red-500 shrink-0" size={18} />
                        <p className="text-xs text-red-200 font-medium">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-[#00FF9D]/20 flex items-center gap-3">
                        <CheckCircle className="text-[#00FF9D] shrink-0" size={18} />
                        <p className="text-xs text-green-200 font-medium">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">

                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FF9D] transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#00FF9D]/50 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FF9D] transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="8+ characters"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#00FF9D]/50 transition-all font-medium text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FF9D] transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className={`w-full bg-white/5 border rounded-xl pl-10 pr-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all font-medium text-sm ${confirmPassword && password !== confirmPassword
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : 'border-white/10 focus:border-[#00FF9D]/50'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3 mt-4 px-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 
                                ${agreed ? 'bg-[#00FF9D] border-[#00FF9D]' : 'bg-white/5 border-gray-600 group-hover:border-[#00FF9D]'}
                            `}>
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                {agreed && <Check size={12} className="text-black stroke-[3]" />}
                            </div>
                            <span className="text-xs text-gray-400 leading-tight">
                                I agree to the <span className="text-[#00FF9D]">Terms of Service</span> and <span className="text-[#00FF9D]">Privacy Policy</span>
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !agreed}
                        className={`w-full font-bold text-base py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 
                            ${!isLoading && agreed
                                ? 'bg-[#00FF9D] text-black hover:shadow-[0_4px_25px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                        {!isLoading && <ChevronRight size={18} strokeWidth={3} />}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-[#050B0D] px-2 text-gray-500 uppercase tracking-widest font-medium">Or</span>
                    </div>
                </div>

                {/* Social Login */}
                <button
                    onClick={() => handleGoogleSignUp()}
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all text-sm"
                >
                    <span className="text-white">Sign up with Google</span>
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-400 mt-8 text-sm">
                    Already have an account?{" "}
                    <button onClick={() => navigate('/mobile/login')} className="text-[#00FF9D] font-bold hover:underline">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default MobileSignup;
