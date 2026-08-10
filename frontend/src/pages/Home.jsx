import { Car, Bike, ShieldCheck, Clock3, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar";

function Home() {

    const navigate = useNavigate();

    return (
        <div className="bg-gray-50">

            {/* Hero */}
            <section className="bg-gray-900 text-white">

                <div className="mx-auto max-w-7xl px-6 pb-28 pt-20">

                    <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
                        Rent. Ride. Repeat.
                    </p>

                    <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
                        Find the right vehicle for your journey.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                        Discover cars, bikes and scooters from trusted
                        rental shops around you.
                    </p>

                </div>

            </section>


            {/* Search */}
            <SearchBar />


            {/* Vehicle Categories */}
            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="mb-10">

                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                        Explore
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        Choose your ride
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Find a vehicle that fits your journey.
                    </p>

                </div>


                <div className="grid gap-6 md:grid-cols-3">

                    {/* Cars */}
                    <div
                        className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:bg-gray-900 group-hover:text-white">
                            <Car size={28} />
                        </div>

                        <h3 className="mt-6 text-xl font-semibold text-gray-900">
                            Cars
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Comfortable rides for city trips, family travel
                            and longer journeys.
                        </p>

                    </div>


                    {/* Bikes */}
                    <div
                        className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:bg-gray-900 group-hover:text-white">
                            <Bike size={28} />
                        </div>

                        <h3 className="mt-6 text-xl font-semibold text-gray-900">
                            Bikes
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Easy and affordable two-wheelers for exploring
                            the city.
                        </p>

                    </div>


                    {/* Scooters */}
                    <div
                        className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:bg-gray-900 group-hover:text-white">
                            <Bike size={28} />
                        </div>

                        <h3 className="mt-6 text-xl font-semibold text-gray-900">
                            Scooters
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Convenient scooters for quick and flexible
                            everyday travel.
                        </p>

                    </div>

                </div>

            </section>


            {/* Why Renstant */}
            <section className="border-y border-gray-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-20">

                    <div className="mb-12 text-center">

                        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Why Renstant
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            Rental made simple
                        </h2>

                    </div>


                    <div className="grid gap-10 md:grid-cols-3">

                        <div className="text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                <ShieldCheck size={26} />
                            </div>

                            <h3 className="mt-5 font-semibold text-gray-900">
                                Trusted Partners
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Discover vehicles listed by rental partners
                                on the Renstant marketplace.
                            </p>

                        </div>


                        <div className="text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                <Clock3 size={26} />
                            </div>

                            <h3 className="mt-5 font-semibold text-gray-900">
                                Real-time Availability
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Check vehicle availability for your selected
                                rental dates before booking.
                            </p>

                        </div>


                        <div className="text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                <WalletCards size={26} />
                            </div>

                            <h3 className="mt-5 font-semibold text-gray-900">
                                Transparent Pricing
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                See rental prices and security deposits
                                clearly before making your booking.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="bg-gray-900">

                <div className="mx-auto max-w-5xl px-6 py-20 text-center text-white">

                    <h2 className="text-3xl font-bold md:text-4xl">
                        Ready to hit the road?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-gray-300">
                        Search available vehicles and find the perfect
                        ride for your next journey.
                    </p>

                    <button
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                        className="mt-8 rounded-xl bg-white px-7 py-3.5 font-semibold text-gray-900 transition hover:bg-gray-100"
                    >
                        Start Searching
                    </button>

                </div>

            </section>


            {/* Footer */}
            <footer className="bg-white">

                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

                    <p>
                        © 2026 Renstant. All rights reserved.
                    </p>

                    <p>
                        Rent. Ride. Repeat.
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default Home;