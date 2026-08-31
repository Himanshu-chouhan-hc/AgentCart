import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  MapPin,
  Plus,
  ShoppingBag,
} from "lucide-react";

import {
  getCart,
  createOrder,
  type CartItem,
} from "../services/cartApi";

import {
  getAddresses,
  type Address,
} from "../services/addressApi";

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 49;

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCheckoutData = async () => {
      const token =
        localStorage.getItem("agentcart_token") ||
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Fetch cart independently
        let itemsList: CartItem[] = [];
        try {
          const cartData = await getCart();
          console.log("Checkout fetched cartData:", cartData);
          itemsList = Array.isArray(cartData)
            ? cartData
            : cartData?.items ?? [];
        } catch (cartErr) {
          console.error("Error fetching cart in Checkout:", cartErr);
        }

        // Fetch addresses independently
        let addressList: Address[] = [];
        try {
          addressList = await getAddresses();
          console.log("Checkout fetched addresses:", addressList);
        } catch (addrErr) {
          console.error("Error fetching addresses in Checkout:", addrErr);
        }

        if (!mounted) return;

        setCartItems(itemsList);
        setAddresses(addressList);

        if (addressList.length > 0) {
          const defaultAddress = addressList.find(
            (address) => address.isDefault
          );
          setSelectedAddress(
            defaultAddress ? defaultAddress.id : addressList[0].id
          );
        }
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load checkout data."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadCheckoutData();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return (
        total +
        Number(item.product?.price || 0) * item.quantity
      );
    }, 0);
  }, [cartItems]);

  const deliveryFee =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_DELIVERY_FEE;

  const total = subtotal + deliveryFee;

  const selectedAddressData = addresses.find(
    (address) => address.id === selectedAddress
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const order = await createOrder({
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      navigate("/orders", {
        state: {
          order,
          addressId: selectedAddress,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not place your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded-lg bg-gray-200" />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="h-[500px] rounded-3xl bg-gray-200" />
              <div className="h-[450px] rounded-3xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag size={38} className="text-gray-400" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#111]">
            Your cart is empty
          </h1>

          <p className="mt-2 max-w-md text-gray-500">
            Add some products to your cart before proceeding
            to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-7 rounded-xl bg-[#F4D000] px-7 py-3 font-bold text-[#111] transition hover:bg-[#e5c600]"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              AgentCart
            </p>
            <h1 className="text-3xl font-bold text-[#111]">
              Checkout
            </h1>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    DELIVERY
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-[#111]">
                    Delivery Address
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/addresses")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
                >
                  <Plus size={16} />
                  Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <MapPin size={36} className="mx-auto text-gray-300" />
                  <h3 className="mt-3 font-bold text-[#111]">
                    No address found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a delivery address to continue.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/addresses")}
                    className="mt-5 rounded-xl bg-[#111] px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {addresses.map((address) => {
                    const isSelected =
                      selectedAddress === address.id;

                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() =>
                          setSelectedAddress(address.id)
                        }
                        className={`w-full rounded-2xl border p-5 text-left transition ${
                          isSelected
                            ? "border-[#F4D000] bg-yellow-50"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-[#111] bg-[#111]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Check
                                size={12}
                                className="text-white"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-[#111]">
                                {address.fullName}
                              </h3>

                              {address.isDefault && (
                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                              {address.phone}
                            </p>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                              {address.street}
                              <br />
                              {address.city}, {address.state} -{" "}
                              {address.zipCode}
                              <br />
                              {address.country || "India"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                ORDER ITEMS
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#111]">
                Your Products
              </h2>

              <div className="mt-6 space-y-5">
                {cartItems.map((item) => {
                  const itemPrice = Number(item.product?.price || 0);
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product?.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag
                              size={26}
                              className="text-gray-300"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-[#111]">
                          {item.product?.name || "Product"}
                        </h3>

                        {item.product?.category && (
                          <p className="mt-1 text-xs text-gray-400">
                            {item.product.category.name}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#111]">
                          ₹{itemPrice.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-[#111]">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 lg:sticky lg:top-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              SUMMARY
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#111]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-[#111]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold">
                  {deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#111]">
                    Total
                  </span>
                  <span className="text-xl font-bold text-[#111]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {selectedAddressData && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-700" />
                  <p className="text-sm font-bold text-[#111]">
                    Delivering to
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-[#111]">
                  {selectedAddressData.fullName}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {selectedAddressData.street}
                  <br />
                  {selectedAddressData.city},{" "}
                  {selectedAddressData.state} -{" "}
                  {selectedAddressData.zipCode}
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={
                placingOrder ||
                !selectedAddress ||
                cartItems.length === 0
              }
              onClick={() => void handlePlaceOrder()}
              className="mt-6 w-full rounded-xl bg-[#F4D000] px-5 py-4 text-sm font-bold text-[#111] transition hover:bg-[#e5c600] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;