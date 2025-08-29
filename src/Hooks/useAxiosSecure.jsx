import useAuth from './useAuth';

const useAxiosSecure = () => {
    const auth = useAuth();
    return auth?.axiosSecure;
};

export default useAxiosSecure;