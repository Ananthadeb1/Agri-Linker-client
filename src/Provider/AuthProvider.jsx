/* eslint-disable no-useless-catch */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
} from "firebase/auth";
import { app } from "../Firebase/firebase.config";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // ✅ Single source of truth
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('access-token');
            navigate('/login'); // ✅ Redirect to login after logout
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(config => {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const responseInterceptor = axiosSecure.interceptors.response.use(response => response,
            async (error) => {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    await logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logout, navigate]);

    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // User will be set automatically via onAuthStateChanged
            return userCredential;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // User will be set automatically via onAuthStateChanged
            return userCredential;
        } catch (error) {
            throw error; // Re-throw error for handling in component
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedUser = result.user;
            const userInfo = {
                uid: loggedUser.uid,
                name: loggedUser.displayName,
                email: loggedUser.email,
                image: loggedUser.photoURL
            };
            await axiosPublic.post("/users", userInfo);
            // User will be set automatically via onAuthStateChanged
            return result;
        } catch (error) {
            throw error; // Re-throw error for handling in component
        } finally {
            setLoading(false);
        }
    };

    // ✅ Unified profile update for both Firebase and MongoDB
    const updateUserProfile = async (updateData) => {
        try {
            // 1. Update Firebase profile
            if (updateData.name || updateData.photoURL) {
                await updateProfile(auth.currentUser, {
                    displayName: updateData.name || auth.currentUser.displayName,
                    photoURL: updateData.photoURL || auth.currentUser.photoURL
                });
            }

            // 2. Update MongoDB using legacy profile route (UID based)
            if (user?.uid) {
                await axiosSecure.patch(`/profile/${user.uid}`, updateData);
            }

            // 3. Refresh user data to sync everywhere
            await fetchUserData(auth.currentUser.email);

            return true;
        } catch (error) {
            console.error("Profile update failed:", error);
            throw error;
        }
    };

    // ✅ Fetch and merge user data
    const fetchUserData = async (email) => {
        try {
            const tokenResponse = await axiosPublic.post('/jwt', { email });
            if (tokenResponse.data.token) {
                localStorage.setItem('access-token', tokenResponse.data.token);

                // Fetch MongoDB user data
                const userResponse = await axiosSecure.get(`/users/${email}`);
                const mongoUser = userResponse.data;

                // Get current Firebase user
                const firebaseUser = auth.currentUser;

                // ✅ Merge data: MongoDB data has priority
                const mergedUser = {
                    ...firebaseUser, // Firebase base data
                    ...mongoUser,    // MongoDB extended data
                    // Ensure we use the latest data
                    displayName: mongoUser?.name || firebaseUser?.displayName,
                    photoURL: mongoUser?.photoURL || firebaseUser?.photoURL,
                    email: mongoUser?.email || firebaseUser?.email,
                    uid: mongoUser?.uid || firebaseUser?.uid
                };

                setUser(mergedUser);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            // Fallback to Firebase user if MongoDB fails
            setUser(auth.currentUser);
        }
    };

    // ✅ Force refresh user data
    const refreshUser = async () => {
        if (auth.currentUser?.email) {
            await fetchUserData(auth.currentUser.email);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await fetchUserData(currentUser.email);
                // ✅ Auto redirect after login
                if (window.location.pathname === '/login') {
                    navigate('/');
                }
            } else {
                setUser(null);
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [axiosPublic, navigate]);

    const authInfo = {
        user, // ✅ Single unified user object
        loading,
        isAuthenticated: !!user,
        createUser,
        login,
        loginWithGoogle,
        logout,
        updateUserProfile,
        refreshUser,
        axiosSecure
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;