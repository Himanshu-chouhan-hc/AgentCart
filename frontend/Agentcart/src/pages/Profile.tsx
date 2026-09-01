import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  CreditCard,
  Edit3,
  Heart,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  getCurrentUser,
  logoutUser,
} from "../services/authApi";
import {
  getAddresses,
  type Address,
} from "../services/addressApi";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  avatar?: string | null;
}

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const userData = await getCurrentUser();
        const addresses = await getAddresses();
        const savedDefaultAddress =
          addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;

        if (isMounted) {
          setUser(userData);
          setDefaultAddress(savedDefaultAddress);
        }
      } catch (err) {
        console.error("Profile error:", err);
        if (isMounted) {
          setError("Unable to load your profile.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="animate-pulse">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="mt-4 h-10 w-48 rounded bg-gray-200" />

            <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="h-96 rounded-2xl bg-gray-200" />
              <div className="h-96 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ================= ERROR ================= */

  if (error || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-5">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <ShieldCheck size={25} className="text-red-500" />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Unable to load profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Please login to continue."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  const initial = user.name?.charAt(0)?.toUpperCase() || "U";
  const profilePhone = defaultAddress?.phone || user.phone || "Not provided";
  const profileLocation =
    defaultAddress
      ? `${defaultAddress.city}, ${defaultAddress.state}`
      : user.location || "Not provided";
  const profileAddressText = defaultAddress
    ? [
        defaultAddress.addressLine1,
        defaultAddress.addressLine2,
        `${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.postalCode}`,
        defaultAddress.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "No address saved yet";

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111111]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#111111]"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#b39a00]">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* ================= PROFILE CARD ================= */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col items-center text-center">
              {/* AVATAR */}
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F4D000] text-4xl font-bold text-[#111111]">
                    {initial}
                  </div>
                )}

                <button
                  type="button"
                  aria-label="Change profile picture"
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#111111] text-white hover:bg-gray-800"
                >
                  <Camera size={15} />
                </button>
              </div>

              {/* USER NAME */}
              <h2 className="mt-5 text-xl font-bold">{user.name}</h2>

              {/* USER EMAIL */}
              <p className="mt-1 max-w-full truncate text-sm text-gray-500">
                {user.email}
              </p>

              {/* VERIFIED */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <ShieldCheck size={14} />
                Verified account
              </div>
            </div>

            {/* MENU */}
            <div className="mt-7 space-y-1 border-t border-gray-100 pt-5">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl bg-yellow-50 px-3 py-3 text-sm font-bold"
              >
                <span className="flex items-center gap-3">
                  <User size={17} />
                  Profile
                </span>
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <Package size={17} />
                  My Orders
                </span>
                <ChevronRight size={16} />
              </button>

              {/* WISHLIST OPTION */}
              <button
                type="button"
                onClick={() => navigate("/wishlist")}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <Heart size={17} />
                  Wishlist
                </span>
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/addresses")}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <MapPin size={17} />
                  Addresses
                </span>
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/payments")}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <CreditCard size={17} />
                  Payments
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="space-y-6">
            {/* PERSONAL INFORMATION */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <h2 className="text-lg font-bold">Personal Information</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your account information.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold hover:border-gray-400"
                >
                  <Edit3 size={15} />
                  Edit
                </button>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <ProfileField
                  label="Full Name"
                  icon={<User size={17} />}
                  value={user.name}
                />

                <ProfileField
                  label="Email Address"
                  icon={<Mail size={17} />}
                  value={user.email}
                />

                <ProfileField
                  label="Phone Number"
                  icon={<Phone size={17} />}
                  value={profilePhone}
                />

                <ProfileField
                  label="Location"
                  icon={<MapPin size={17} />}
                  value={profileLocation}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Saved Address
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/addresses")}
                    className="text-xs font-semibold text-[#111111] hover:text-[#b39a00]"
                  >
                    Manage
                  </button>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-700">
                  {profileAddressText}
                </p>
              </div>
            </section>

            {/* SECURITY */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
              <h2 className="text-lg font-bold">Security</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your password and account security.
              </p>

              <div className="mt-5 rounded-xl border border-gray-200">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                      <Lock size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold">Change Password</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Update your account password
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={17} className="text-gray-400" />
                </button>
              </div>
            </section>

            {/* LOGOUT */}
            <section className="rounded-2xl border border-red-100 bg-white p-6">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <LogOut size={18} className="text-red-500" />
                </div>

                <div>
                  <p className="text-sm font-bold text-red-600">Logout</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Sign out from your AgentCart account
                  </p>
                </div>
              </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

/* ================= REUSABLE FIELD ================= */

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ReactNode;
}

const ProfileField = ({ label, value, icon }: ProfileFieldProps) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <span className="shrink-0 text-gray-400">{icon}</span>
        <span className="truncate text-sm font-medium">{value}</span>
      </div>
    </div>
  );
};

export default Profile;