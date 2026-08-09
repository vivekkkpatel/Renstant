import SearchBar from "../components/SearchBar";

function Home() {
    return (
        <div className="min-h-screen bg-gray-50">

            <section className="bg-gray-900 text-white">
                <div className="mx-auto max-w-7xl px-6 py-24">

                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                        Rent. Ride. Repeat.
                    </p>

                    <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
                        Find the right vehicle for your journey.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-gray-300">
                        Discover cars, bikes and scooters from trusted
                        rental shops around you.
                    </p>

                </div>
            </section>

            <SearchBar />

        </div>
    );
}

export default Home;