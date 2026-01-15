"use client";
import { useGetMeQuery } from "@/app/store/api/services/AuthApi";
import { logOut, setCredentials } from "@/app/store/slices/authSlice";
import { RootState } from "@/app/store/store";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { token, user: storedUser } = useSelector((state: RootState) => state.auth);

    // Fetch latest user data or use stored data
    const { data: apiUser, error, isLoading } = useGetMeQuery(undefined, {
        skip: !token
    });

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    // Update store if API returns fresh data
    useEffect(() => {
        if (apiUser) {
            // We need the token to be preserved, so we pass it along or just update the user part
            // But setCredentials expects {user, token}. 
            // If the API doesn't return the token again, we reuse the existing one.
            dispatch(setCredentials({ user: apiUser, token: token! }));
        }
    }, [apiUser, dispatch, token]);

    const handleLogout = () => {
        dispatch(logOut());
        toast.success("Logged out successfully");
        router.push("/");
    };

    if (isLoading && !storedUser) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    const user = apiUser || storedUser;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#080705] py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 border-l-4 border-[#fada1d] pl-4">
                    My Profile
                </h1>

                <div className="bg-zinc-900 rounded-2xl p-8 border border-white/10 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-[#fada1d] overflow-hidden shrink-0">
                            {user.profilePicture ? (
                                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-[#fada1d]" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-zinc-400 text-sm">Name</label>
                                    <div className="text-white text-xl font-medium">{user.name}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-zinc-400 text-sm">Email</label>
                                    <div className="text-white text-xl font-medium">{user.email || "Not provided"}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-zinc-400 text-sm">Phone</label>
                                    <div className="text-white text-xl font-medium">{user.phone}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-zinc-400 text-sm">Wallet Balance</label>
                                    <div className="text-[#fada1d] text-xl font-bold">₹ {user.walletBalance}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-zinc-400 text-sm">Role</label>
                                    <div className="text-white text-xl font-medium capitalize">{user.role}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-zinc-400 text-sm">Verified Status</label>
                                    <div className={`text-xl font-medium ${user.verified ? 'text-green-500' : 'text-red-500'}`}>
                                        {user.verified ? 'Verified' : 'Unverified'}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium border border-red-500/20"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
