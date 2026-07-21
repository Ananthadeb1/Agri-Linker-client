import { useState } from 'react';
import {
    faBars, faTimes, faUsers, faHotel, 
    faBox, faShoppingCart, faUserCheck, 
    faHandHoldingUsd, faChartLine, faChartBar,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserManagement from './UserManagement/UserManagement';
import OrderManagement from './OrderManagement/OrderManagement';
import ProductManagement from './ProductManagement/ProductManagement';
import FarmerVerification from './FarmerVerification/FarmerVerification';
import LoanManagement from './LoanManagement/LoanManagement';
import InvestmentManagement from './InvestmentManagement/InvestmentManagement';
import AnalyticsReports from './AnalyticsReports/AnalyticsReports';

const Dashboard = () => {
    const [selected, setSelected] = useState('User Management');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'User Management', icon: faUsers },
        { name: 'Order Management', icon: faShoppingCart },
        { name: 'Product Management', icon: faBox },
        { name: 'Farmer Verification', icon: faUserCheck },
        { name: 'Loan Management', icon: faHandHoldingUsd },
        { name: 'Investment Management', icon: faChartLine },
        { name: 'Analytics & Reports', icon: faChartBar },
    ];

    const renderComponent = () => {
        switch (selected) {
            case 'User Management': return <UserManagement />;
            case 'Order Management': return <OrderManagement />;
            case 'Product Management': return <ProductManagement />;
            case 'Farmer Verification': return <FarmerVerification />;
            case 'Loan Management': return <LoanManagement />;
            case 'Investment Management': return <InvestmentManagement />;
            case 'Analytics & Reports': return <AnalyticsReports />;
            default: return <UserManagement />;
        }
    };

    return (
        /* Root container with absolute horizontal scroll lock */
        <div className="flex min-h-screen bg-slate-50 relative w-full max-w-full overflow-x-hidden">
            
            {/* 1. Mobile Top Bar (Only visible on small devices) */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 py-3 flex items-center justify-between shadow-sm h-16 w-full">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
                        <FontAwesomeIcon icon={faHotel} size="sm" />
                    </div>
                    <span className="font-bold text-base text-emerald-700 truncate">Admin Panel</span>
                </div>
                <button
                    className="p-2 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-colors focus:outline-none shrink-0"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="lg" />
                </button>
            </div>

            {/* 2. Mobile Backdrop Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* 3. Responsive Fixed Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 md:z-20 w-[260px] sm:w-[280px] h-screen bg-white border-r border-emerald-100 p-4 sm:p-5 flex flex-col justify-between transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none`}
            >
                {/* Header & Menu Items */}
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex items-center gap-3 text-slate-900 mb-6 pt-2 md:pt-0 shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
                            <FontAwesomeIcon icon={faHotel} size="lg" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-emerald-700 leading-tight truncate">Admin Panel</h2>
                            <p className="text-xs text-slate-500 font-medium truncate">Agri Platform</p>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                        {menuItems.map((item, index) => {
                            const isActive = selected === item.name;
                            return (
                                <button
                                    key={index}
                                    className={`w-full text-left p-3 rounded-xl sm:rounded-2xl flex items-center transition-all duration-200 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-emerald-600 to-lime-600 text-white shadow-md font-semibold'
                                            : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium'
                                    }`}
                                    onClick={() => {
                                        setSelected(item.name);
                                        setIsSidebarOpen(false);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className={`mr-3 w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`}
                                    />
                                    <span className="text-xs sm:text-sm truncate">{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* 4. Main Content Wrapper */}
            <main className="flex-1 w-full max-w-full md:ml-[280px] flex flex-col min-h-screen pt-16 md:pt-0 min-w-0 overflow-x-hidden">
                {/* Responsive Header Banner */}
                <header className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gradient-to-b from-emerald-50/80 to-transparent border-b border-emerald-100/60 w-full">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
                            <FontAwesomeIcon
                                icon={menuItems.find(item => item.name === selected)?.icon || faUsers}
                                className="text-lg sm:text-xl"
                            />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight truncate">
                                {selected}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 break-words line-clamp-2 sm:line-clamp-none">
                                Manage admin settings, users, products, and reports seamlessly.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Selected Component View */}
                <section className="p-3 sm:p-6 md:p-8 flex-1 w-full max-w-full min-w-0">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-emerald-100 p-3 sm:p-6 min-h-[calc(100vh-10rem)] w-full max-w-full overflow-x-auto">
                        {renderComponent()}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;