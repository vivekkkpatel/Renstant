// import { useState } from "react";
// import {
//     Eye,
//     EyeOff,
//     Lock,
//     Mail,
//     User,
//     Phone,
//     Calendar
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import { register } from "../services/authService";

// function Register() {

//     const navigate = useNavigate();

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [dateOfBirth, setDateOfBirth] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [role, setRole] = useState("CUSTOMER");

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] =
//         useState(false);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         setError("");
//         setSuccess("");

//         if (password !== confirmPassword) {
//             setError("Passwords do not match.");
//             return;
//         }

//         try {

//             setLoading(true);

//             await register({
//                 name: name.trim(),
//                 email: email.trim(),
//                 phone: phone.trim(),
//                 dateOfBirth,
//                 password,
//                 role
//             });

//             setSuccess(
//                 "Account created successfully! Redirecting to login..."
//             );

//             setTimeout(() => {
//                 navigate("/login");
//             }, 1200);

//         } catch (err) {

//             console.error(err);

//             setError(
//                 err.response?.data?.message ||
//                 "Registration failed. Please try again."
//             );

//         } finally {

//             setLoading(false);

//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10">

//             <div className="w-full max-w-md">

//                 <div className="rounded-3xl bg-white p-8 shadow-sm">

//                     {/* Header */}

//                     <div className="text-center">

//                         <h1 className="text-3xl font-bold text-gray-900">
//                             Create your account
//                         </h1>

//                         <p className="mt-2 text-sm text-gray-500">
//                             Join Renstant today
//                         </p>

//                     </div>

//                     {/* Error */}

//                     {error && (
//                         <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                             {error}
//                         </div>
//                     )}

//                     {/* Success */}

//                     {success && (
//                         <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//                             {success}
//                         </div>
//                     )}

//                     <form
//                         onSubmit={handleSubmit}
//                         className="mt-8 space-y-5"
//                     >

//                         {/* Name */}

//                         <div>

//                             <label className="mb-2 block text-sm font-medium text-gray-700">
//                                 Full Name
//                             </label>

//                             <div className="relative">

//                                 <User
//                                     size={18}
//                                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 />

//                                 <input
//                                     type="text"
//                                     value={name}
//                                     onChange={(e) =>
//                                         setName(e.target.value)
//                                     }
//                                     placeholder="Your full name"
//                                     className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-gray-900"
//                                     required
//                                 />

//                             </div>

//                         </div>

//                         {/* Email */}

//                         <div>

//                             <label className="mb-2 block text-sm font-medium text-gray-700">
//                                 Email
//                             </label>

//                             <div className="relative">

//                                 <Mail
//                                     size={18}
//                                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 />

//                                 <input
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) =>
//                                         setEmail(e.target.value)
//                                     }
//                                     placeholder="you@example.com"
//                                     className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-gray-900"
//                                     required
//                                 />

//                             </div>

//                         </div>

//                         {/* Phone */}

//                         <div>

//                             <label className="mb-2 block text-sm font-medium text-gray-700">
//                                 Phone
//                             </label>

//                             <div className="relative">

//                                 <Phone
//                                     size={18}
//                                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 />

//                                 <input
//                                     type="tel"
//                                     value={phone}
//                                     onChange={(e) =>
//                                         setPhone(e.target.value)
//                                     }
//                                     placeholder="10-digit phone number"
//                                     className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-gray-900"
//                                     required
//                                 />

//                             </div>

//                         </div>

//                         {/* Date of Birth */}

//                         <div>

//                             <label className="mb-2 block text-sm font-medium text-gray-700">
//                                 Date of Birth
//                             </label>

//                             <div className="relative">

//                                 <Calendar
//                                     size={18}
//                                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 />

//                                 <input
//                                     type="date"
//                                     value={dateOfBirth}
//                                     onChange={(e) =>
//                                         setDateOfBirth(e.target.value)
//                                     }
//                                     className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-gray-900"
//                                     required
//                                 />

//                             </div>

//                         </div>

//                         {/* Password */}

//                         <div>

//                             <label className="mb-2 block text-sm font-medium text-gray-700">
//                                 Password
//                             </label>

//                             <div className="relative">

//                                 <Lock
//                                     size={18}
//                                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 />

//                                 <input
//                                     type={
//                                         showPassword
//                                             ? "text"
//                                             : "password"
//                                     }
//                                     value={password}
//                                     onChange={(e) =>
//                                         setPassword(e.target.value)
//                                     }
//                                     placeholder="Enter your password"
//                                     className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-11 outline-none focus:border-gray-900"
//                                     required
//                                     minLength={8}
//                                 />

//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setShowPassword(
//                                             !showPassword
//                                         )
//                                     }
//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                                 >
//                                     {showPassword ? (
//                                         <EyeOff size={18} />
//                                     ) : (
//                                         <Eye size={18} />
//                                     )}
//                                 </button>

//                             </div>

//                         </div>

//                         {/* Confirm Password */}

//                         <div>

//                             <label className="mb-2 block text-sm font-medium text-gray-700">
//                                 Confirm Password
//                             </label>

//                             <div className="relative">

//                                 <Lock
//                                     size={18}
//                                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 />

//                                 <input
//                                     type={
//                                         showConfirmPassword
//                                             ? "text"
//                                             : "password"
//                                     }
//                                     value={confirmPassword}
//                                     onChange={(e) =>
//                                         setConfirmPassword(
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Confirm your password"
//                                     className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-11 outline-none focus:border-gray-900"
//                                     required
//                                     minLength={8}
//                                 />

//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setShowConfirmPassword(
//                                             !showConfirmPassword
//                                         )
//                                     }
//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                                 >
//                                     {showConfirmPassword ? (
//                                         <EyeOff size={18} />
//                                     ) : (
//                                         <Eye size={18} />
//                                     )}
//                                 </button>

//                             </div>

//                         </div>

//                         {/* Account Type */}

//                         <div>

//                             <label className="mb-2 block text-sm font-medium text-gray-700">
//                                 Account Type
//                             </label>

//                             <select
//                                 value={role}
//                                 onChange={(e) =>
//                                     setRole(e.target.value)
//                                 }
//                                 className="w-full rounded-xl border border-gray-200 bg-white py-3 px-3 outline-none focus:border-gray-900"
//                             >
//                                 <option value="CUSTOMER">
//                                     Customer
//                                 </option>

//                                 <option value="PARTNER">
//                                     Partner
//                                 </option>
//                             </select>

//                         </div>

//                         {/* Submit */}

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             {loading
//                                 ? "Creating account..."
//                                 : "Create Account"}
//                         </button>

//                     </form>

//                     {/* Login */}

//                     <p className="mt-6 text-center text-sm text-gray-500">

//                         Already have an account?{" "}

//                         <button
//                             onClick={() =>
//                                 navigate("/login")
//                             }
//                             className="font-semibold text-gray-900 hover:underline"
//                         >
//                             Sign in
//                         </button>

//                     </p>

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default Register;

import { useState } from "react";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Phone,
    Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { register } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("CUSTOMER");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            await register({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                dateOfBirth,
                password,
                role
            });

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">

            <div className="mx-auto w-full max-w-4xl">

                <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">

                    {/* Header */}

                    <div className="text-center">

                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 sm:text-base">
                            Join Renstant today
                        </p>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Success */}

                    {success && (
                        <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2"
                    >

                        {/* Name */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Full Name
                            </label>

                            <div className="relative">

                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Your full name"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none transition focus:border-gray-900"
                                    required
                                />

                            </div>

                        </div>

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
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none transition focus:border-gray-900"
                                    required
                                />

                            </div>

                        </div>

                        {/* Phone */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Phone
                            </label>

                            <div className="relative">

                                <Phone
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    placeholder="10-digit phone number"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none transition focus:border-gray-900"
                                    required
                                />

                            </div>

                        </div>

                        {/* Date of Birth */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Date of Birth
                            </label>

                            <div className="relative">

                                <Calendar
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) =>
                                        setDateOfBirth(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none transition focus:border-gray-900"
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
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-11 outline-none transition focus:border-gray-900"
                                    required
                                    minLength={8}
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

                        {/* Confirm Password */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm your password"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-11 outline-none transition focus:border-gray-900"
                                    required
                                    minLength={8}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Account Type */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Account Type
                            </label>

                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 outline-none transition focus:border-gray-900"
                            >
                                <option value="CUSTOMER">
                                    Customer
                                </option>

                                <option value="PARTNER">
                                    Partner
                                </option>
                            </select>

                        </div>

                        {/* Submit */}

                        <div className="md:col-span-2">

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create Account"}
                            </button>

                        </div>

                    </form>

                    {/* Login */}

                    <p className="mt-6 text-center text-sm text-gray-500">

                        Already have an account?{" "}

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className="font-semibold text-gray-900 hover:underline"
                        >
                            Sign in
                        </button>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;