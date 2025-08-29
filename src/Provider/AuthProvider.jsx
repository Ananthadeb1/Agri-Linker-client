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
    const [user, setUser] = useState(null);
    const [loggedUser, setLoggedUser] = useState(null);
    const [loading, setLoading] = useState(true); // Combined loading state
    const [profileUpdating, setProfileUpdating] = useState(false); // Only for profile updates
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            setLoggedUser(null);
            localStorage.removeItem('access-token');
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
                    navigate('/login');
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
            setUser(userCredential.user);
            return userCredential;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            await fetchUserData(userCredential.user.email);
            return userCredential;
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
            setUser(loggedUser);
            await fetchUserData(loggedUser.email);
            return result;
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (name, photo) => {
        setProfileUpdating(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photo
            });
            setUser({ ...auth.currentUser });
            // Refresh user data after profile update
            await fetchUserData(auth.currentUser.email);
        } finally {
            setProfileUpdating(false);
        }
    };

    const fetchUserData = async (email) => {
        try {
            const tokenResponse = await axiosPublic.post('/jwt', { email });
            if (tokenResponse.data.token) {
                localStorage.setItem('access-token', tokenResponse.data.token);
                const userResponse = await axiosSecure.get(`/users/${email}`);
                setLoggedUser(userResponse.data);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            // If fetching user data fails, log out the user
            await logout();
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await fetchUserData(currentUser.email);
            } else {
                setUser(null);
                setLoggedUser(null);
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [axiosPublic]);

    const authInfo = {
        user: loggedUser, // Use loggedUser as the main user object
        loading,
        profileUpdating,
        isAuthenticated: !!user,
        createUser,
        login,
        loginWithGoogle,
        logout,
        updateUserProfile,
        setUser,
        fetchUserData,
        axiosSecure
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;