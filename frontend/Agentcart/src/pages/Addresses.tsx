import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
  type AddressInput,
} from "../services/addressApi";

const emptyForm: AddressInput = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<AddressInput>(emptyForm);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [defaultId, setDefaultId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // LOAD ADDRESSES
  // =========================
  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDefaultChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      isDefault: event.target.checked,
    }));
  };

  // =========================
  // OPEN ADD FORM
  // =========================
  const handleAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      isDefault: addresses.length === 0,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================
  const handleEdit = (address: Address) => {
    setEditingId(address.id);

    setForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || "India",
      isDefault: address.isDefault,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateAddress(editingId, form);
        setSuccess("Address updated successfully.");
      } else {
        await createAddress(form);
        setSuccess("Address added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteAddress(id);

      setAddresses((prev) =>
        prev.filter((address) => address.id !== id)
      );

      setSuccess("Address deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete address."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // SET DEFAULT
  // =========================
  const handleSetDefault = async (id: string) => {
    try {
      setDefaultId(id);
      setError("");
      setSuccess("");

      const updatedAddress = await setDefaultAddress(id);

      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address.id === updatedAddress.id,
        }))
      );

      setSuccess("Default address updated.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to set default address."
      );
    } finally {
      setDefaultId(null);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-9 w-48 rounded-lg bg-gray-200" />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="h-56 rounded-3xl bg-gray-200" />
              <div className="h-56 rounded-3xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              AgentCart
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#111]">
              My Addresses
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your delivery addresses
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#F4D000] px-5 py-3 font-bold text-[#111] transition hover:bg-[#e5c600]"
          >
            <Plus size={18} />
            Add Address
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            <X size={18} />
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <Check size={18} />
            {success}
          </div>
        )}

        {/* =========================
            FORM
        ========================= */}
        {showForm && (
          <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {editingId ? "EDIT ADDRESS" : "NEW ADDRESS"}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {editingId
                    ? "Update Address"
                    : "Add New Address"}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">

                {/* FULL NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#F4D000] focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    minLength={10}
                    placeholder="10 digit mobile number"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#F4D000] focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* ADDRESS LINE 1 */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Address
                  </label>

                  <input
                    type="text"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    required
                    placeholder="House no, street, area"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#F4D000] focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* ADDRESS LINE 2 */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Address Line 2
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    name="addressLine2"
                    value={form.addressLine2 || ""}
                    onChange={handleChange}
                    placeholder="Apartment, landmark, etc."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#F4D000] focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* CITY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Delhi"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#F4D000] focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* STATE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    placeholder="Delhi"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#F4D000] focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* POSTAL CODE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                    minLength={5}
                    placeholder="110001"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#F4D000] focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {/* COUNTRY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={form.country || "India"}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              {/* DEFAULT */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isDefault ?? false}
                  onChange={handleDefaultChange}
                  className="h-4 w-4 accent-[#111]"
                />

                <span className="text-sm font-semibold">
                  Set as default address
                </span>
              </label>

              {/* BUTTONS */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F4D000] px-5 py-3 font-bold text-[#111] transition hover:bg-[#e5c600] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* =========================
            ADDRESS LIST
        ========================= */}
        {addresses.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
              <MapPin size={30} className="text-[#111]" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No addresses yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add an address for faster checkout.
            </p>

            {!showForm && (
              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 rounded-xl bg-[#111] px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
              >
                Add Your First Address
              </button>
            )}
          </section>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {addresses.map((address) => (
              <article
                key={address.id}
                className={`relative rounded-3xl border bg-white p-6 transition ${
                  address.isDefault
                    ? "border-[#F4D000] shadow-sm"
                    : "border-gray-200"
                }`}
              >
                {/* DEFAULT BADGE */}
                {address.isDefault && (
                  <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    <Check size={13} />
                    Default
                  </div>
                )}

                {/* NAME */}
                <div className="flex items-center gap-3 pr-20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {address.fullName}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {address.phone}
                    </p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    {address.addressLine1}

                    {address.addressLine2 && (
                      <>
                        <br />
                        {address.addressLine2}
                      </>
                    )}

                    <br />

                    {address.city}, {address.state} -{" "}
                    {address.postalCode}

                    <br />

                    {address.country}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === address.id ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}

                    Delete
                  </button>

                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        void handleSetDefault(address.id)
                      }
                      disabled={defaultId === address.id}
                      className="ml-auto rounded-xl bg-[#111] px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {defaultId === address.id
                        ? "Updating..."
                        : "Make Default"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Addresses;