import React, { useState } from 'react';
import {
    ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Lock, Mail, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google'; // Still disabled to prevent crash
import API_BASE_URL from '../../config';
import { setToken, setUserRole } from '../../utils/token';

const MobileLogin = () => {
    const navigate = useNavigate();

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // --- STANDARD LOGIN RESTORED ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token, true);
                if (data.user && data.user.role) {
                    setUserRole(data.user.role, true);
                }

                const userRes = await fetch(`${API_BASE_URL}/user/me`, {
                    headers: { 'Authorization': `Bearer ${data.token}` }
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setSuccess('Welcome back!');
                    setTimeout(() => {
                        if (!userData.profileComplete) {
                            navigate('/bot-builder');
                        } else {
                            navigate('/dashboard');
                        }
                    }, 1000);
                } else {
                    setSuccess('Login successful!');
                    setTimeout(() => navigate('/bot-builder'), 1000);
                }
            } else {
                setError(data.message || 'Invalid credentials.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setError('Check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Google login disabled to isolate crash
        setError("Google Login is currently disabled for maintenance.");
    };

    return (
        <div className="min-h-screen bg-[#050B0D] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[50vh] bg-[#00FF9D]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[50vh] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="p-6 flex items-center justify-between z-10">
                <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-center px-6 pb-12 z-10 max-w-md mx-auto w-full">

                {/* Title Section */}
                <div className="mb-10 text-center">
                    <div className="flex justify-center mb-8">
                        <img src="/logo.png" alt="FydBlock" className="w-32 object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to manage your portfolio</p>
                </div>

                {/* Notifications */}
                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                        <AlertCircle className="text-red-500 shrink-0" size={18} />
                        <p className="text-sm text-red-200 font-medium">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-[#00FF9D]/20 flex items-center gap-3">
                        <CheckCircle className="text-[#00FF9D] shrink-0" size={18} />
                        <p className="text-sm text-green-200 font-medium">{success}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
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
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#00FF9D]/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                            <button
                                type="button"
                                onClick={() => navigate('/mobile/reset-password')}
                                className="text-xs text-[#00FF9D] font-medium hover:underline"
                            >
                                Forgot?
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FF9D] transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#00FF9D]/50 transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#00FF9D] text-black font-bold text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,255,157,0.2)] hover:shadow-[0_4px_25px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                        {!isLoading && <ChevronRight size={20} strokeWidth={3} />}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-[#050B0D] px-2 text-gray-500 uppercase tracking-widest font-medium">Or continue with</span>
                    </div>
                </div>

                {/* Social Login */}
                <button
                    onClick={() => handleGoogleLogin()}
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                    <span className="text-white">Google</span>
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-gray-400 mt-10">
                    Don't have an account?{" "}
                    <button onClick={() => navigate('/mobile/signup')} className="text-[#00FF9D] font-bold hover:underline">
                        Create one
                    </button>
                </p>
            </div>
        </div>
    );
};

export default MobileLogin;
