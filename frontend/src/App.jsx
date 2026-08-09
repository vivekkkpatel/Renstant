import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import VehicleDetails from "./pages/VehicleDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import PartnerBookings from "./pages/PartnerBookings";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerVehicles from "./pages/PartnerVehicles";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/search" element={<SearchResults />} />

        <Route path="/vehicles/:vehicleId" element={<VehicleDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/bookings" element={<MyBookings />} />

        <Route path="/vehicles/:vehicleId/book" element={<BookingPage />} />

        <Route path="/bookings/:bookingId" element={<BookingConfirmation />} />

        <Route path="/partner/bookings" element={<PartnerBookings />} />

        <Route path="/partner/dashboard" element={<PartnerDashboard />} />

        <Route path="/partner/vehicles" element={<PartnerVehicles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
