import useAuth from "../../../Hooks/useAuth";

const Home = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 >{user?.name} Welcome to the Home Page</h1>
            <h1 > your role is: {user?.role} </h1>
        </div>
    );
};

export default Home;