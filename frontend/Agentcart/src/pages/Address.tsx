import {
  ArrowLeft,
  Check,
  Home,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressApi";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type FormData = Omit<Address, "id" | "isDefault"> & { isDefault?: boolean };

const AddressPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      setAddresses([]);
      setError(err instanceof Error ? err.message : "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, isDefault: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const submitData = { ...formData, isDefault: formData.isDefault || false };
      if (editingId) {
        await updateAddress(editingId, submitData);
      } else {
        await createAddress(submitData);
      }
      await loadAddresses();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set default address");
    }
  };

  const getAddressIcon = (address: Address) => {
    if (address.addressLine1.toLowerCase().includes("home"))
      return <Home size={20} />;
    if (address.addressLine1.toLowerCase().includes("work"))
      return <MapPin size={20} />;
    return <MapPin size={20} />;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="mt-4 h-10 w-48 rounded bg-gray-200" />
            <div className="mt-8 h-96 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-sm text-gray-500">Checkout</p>

            <h1 className="text-2xl font-bold tracking-tight">
              Delivery Address
            </h1>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* LEFT */}
          <div>
            {/* Add Address Button */}
            {!showForm && (
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Your addresses</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose where you want your order delivered.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  <Plus size={17} />
                  Add Address
                </button>
              </div>
            )}

            {/* Form */}
            {showForm && (
              <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-bold">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D000]"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D000]"
                    />
                  </div>

                  <textarea
                    name="addressLine1"
                    placeholder="Address Line 1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D000]"
                  />

                  <textarea
                    name="addressLine2"
                    placeholder="Address Line 2 (Optional)"
                    value={formData.addressLine2 || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D000]"
                  />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D000]"
                    />

                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D000]"
                    />

                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D000]"
                    />
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault || false}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-200"
                    />
                    <span className="text-sm font-medium">
                      Set as default address
                    </span>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-[#111111] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
                    >
                      {submitting ? "Saving..." : editingId ? "Update" : "Add"} Address
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setFormData({
                          fullName: "",
                          phone: "",
                          addressLine1: "",
                          addressLine2: "",
                          city: "",
                          state: "",
                          postalCode: "",
                          country: "India",
                          isDefault: false,
                        });
                      }}
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-bold transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address List */}
            <div className="space-y-4">
              {(!Array.isArray(addresses) || addresses.length === 0) ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                  <MapPin size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">No addresses yet.</p>
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="mt-3 rounded-lg bg-[#111111] px-4 py-2 text-sm font-bold text-white"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`rounded-2xl bg-white p-5 ${
                      address.isDefault
                        ? "border-2 border-[#F4D000] shadow-sm"
                        : "border border-gray-200"
                    }`}
                  >
                    {address.isDefault && (
                      <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-gray-900">
                        <Check size={13} />
                        Default
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                        {getAddressIcon(address)}
                      </div>

                      <div className="flex-1 pr-20">
                        <h3 className="font-bold">{address.addressLine1}</h3>

                        <p className="mt-2 text-sm font-semibold text-gray-800">
                          {address.fullName}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {address.addressLine1}
                          {address.addressLine2 && (
                            <>
                              <br />
                              {address.addressLine2}
                            </>
                          )}
                          <br />
                          {address.city}, {address.state} - {address.postalCode}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                          <Phone size={15} />
                          {address.phone}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold transition hover:bg-gray-50"
                        >
                          <Check size={14} />
                          Set Default
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEdit(address)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold transition hover:bg-gray-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(address.id)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">₹4,298</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-semibold text-green-600">-₹300</span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold">₹3,998</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F4D000] py-3.5 text-sm font-bold text-[#111111] transition hover:bg-[#e6c700]"
            >
              Continue to Payment
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              You can change your address before payment.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default AddressPage;