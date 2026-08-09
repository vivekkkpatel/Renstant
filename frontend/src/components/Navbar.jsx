import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

function Navbar() {

    const navigate = useNavigate();

    const { user, logout, isLoggedIn } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {

        logout();

        setMenuOpen(false);

        navigate("/");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}

                <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-2xl font-bold tracking-tight text-gray-900"
                >
                    Renstant
                </Link>


                {/* Desktop Navigation */}

                <div className="hidden items-center gap-7 md:flex">

                    <Link
                        to="/"
                        className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                    >
                        Home
                    </Link>

                    <Link
                        to="/search"
                        className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                    >
                        Vehicles
                    </Link>


                    {isLoggedIn && user?.role === "CUSTOMER" && (

                        <Link
                            to="/bookings"
                            className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                        >
                            My Bookings
                        </Link>

                    )}


                    {isLoggedIn && user?.role === "PARTNER" && (

                        <>
                            <Link
                                to="/partner/dashboard"
                                className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/partner/vehicles"
                                className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                            >
                                Vehicles
                            </Link>

                            <Link
                                to="/partner/bookings"
                                className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                            >
                                Bookings
                            </Link>
                        </>

                    )}

                </div>


                {/* Desktop Auth */}

                <div className="hidden items-center gap-4 md:flex">

                    {isLoggedIn ? (

                        <>

                            <div className="flex items-center gap-2">

                                <UserCircle
                                    size={20}
                                    className="text-gray-500"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    {user?.name}
                                </span>

                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                Register
                            </Link>

                        </>

                    )}

                </div>


                {/* Mobile Menu Button */}

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </button>

            </div>


            {/* Mobile Navigation */}

            {menuOpen && (

                <div className="border-t border-gray-200 px-6 py-4 md:hidden">

                    <div className="flex flex-col gap-4">

                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="text-sm font-medium text-gray-700"
                        >
                            Home
                        </Link>

                        <Link
                            to="/search"
                            onClick={closeMenu}
                            className="text-sm font-medium text-gray-700"
                        >
                            Vehicles
                        </Link>


                        {isLoggedIn &&
                            user?.role === "CUSTOMER" && (

                                <Link
                                    to="/bookings"
                                    onClick={closeMenu}
                                    className="text-sm font-medium text-gray-700"
                                >
                                    My Bookings
                                </Link>

                            )}


                        {isLoggedIn &&
                            user?.role === "PARTNER" && (

                                <>
                                    <Link
                                        to="/partner/dashboard"
                                        onClick={closeMenu}
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        to="/partner/vehicles"
                                        onClick={closeMenu}
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Vehicles
                                    </Link>

                                    <Link
                                        to="/partner/bookings"
                                        onClick={closeMenu}
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Bookings
                                    </Link>
                                </>

                            )}


                        {isLoggedIn ? (

                            <>

                                <div className="flex items-center gap-2 border-t border-gray-100 pt-4">

                                    <UserCircle
                                        size={20}
                                        className="text-gray-500"
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.name}
                                    </span>

                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white"
                                >
                                    Logout
                                </button>

                            </>

                        ) : (

                            <>

                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white"
                                >
                                    Register
                                </Link>

                            </>

                        )}

                    </div>

                </div>

            )}

        </nav>
    );
}

export default Navbar;