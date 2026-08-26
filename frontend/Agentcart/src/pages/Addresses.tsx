import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Plus } from "lucide-react";

import {
  getAddresses,
  createAddress, // <-- Yahan createAddressAPI ko createAddress kar dein
  type Address,
} from "../services/addressApi";

const Addresses: React.FC = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: true,
  });

  useEffect(() => {
    void loadAddresses();
  }, []);

  const loadAddresses = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault();
  setErrorMessage("");

  try {
    setSaving(true);
    // Yahan createAddress call hoga
    const savedAddress = await createAddress(formData);

    if (savedAddress && savedAddress.id) {
      localStorage.setItem("selected_address_id", savedAddress.id);
      navigate("/checkout", {
        state: { selectedAddressId: savedAddress.id },
      });
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to add address";
    setErrorMessage(message);
  } finally {
    setSaving(false);
  }
};

  const handleSelectAddress = (addressId: string) => {
    localStorage.setItem("selected_address_id", addressId);
    navigate("/checkout", { state: { selectedAddressId: addressId } });
  };

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 pt-28 pb-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Manage
              </p>
              <h1 className="text-3xl font-bold">Delivery Addresses</h1>
            </div>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-xl bg-[#F4D000] px-5 py-3 font-bold text-[#111] transition hover:bg-[#e0c000]"
            >
              <Plus size={18} /> Add New Address
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold">Add New Delivery Address</h2>

            {errorMessage && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600 border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="House / Flat / Street / Area"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Mumbai"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Maharashtra"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  PIN / ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="400001"
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50"
              >
                {saving ? "Saving to Server..." : "Save Address"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Loading addresses...
            </div>
          ) : addresses.length === 0 && !showForm ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <MapPin size={40} className="mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-bold">No saved addresses</h3>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr.id)}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-black hover:shadow-md"
              >
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {addr.fullName}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {addr.phone}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-800 transition group-hover:bg-black group-hover:text-white"
                >
                  Deliver Here
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Addresses;