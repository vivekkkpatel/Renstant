import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {

    const { login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            const user = await login(
                email,
                password
            );

            /*
             * If the customer came from the
             * booking flow, send them back
             * there after login.
             */
            const from =
                location.state?.from || "/";

            navigate(from);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

            <div className="w-full max-w-md">

                <div className="rounded-3xl bg-white p-8 shadow-sm">

                    <div className="text-center">

                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue to Renstant
                        </p>

                    </div>

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-gray-900"
                                    required
                                />

                            </div>

                        </div>

                        {/* Password */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-11 outline-none focus:border-gray-900"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <button
                            onClick={() =>
                                navigate("/register")
                            }
                            className="font-semibold text-gray-900 hover:underline"
                        >
                            Create one
                        </button>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;