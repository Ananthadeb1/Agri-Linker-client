import { Outlet } from 'react-router-dom';
import NavBar from '../Shared/NavBar/NavBar';
import Footer from '../Shared/Footer/Footer';
import AuthProvider from '../Provider/AuthProvider';

const Main = () => {
    return (
        <AuthProvider>
            <div className='bg-gradient-to-r from-[#FEF0F2] to-[#EEF2FF] min-h-screen text-black'>
                <NavBar></NavBar>
                <Outlet></Outlet>
                <Footer></Footer>
            </div>
        </AuthProvider>
    );
};

export default Main;