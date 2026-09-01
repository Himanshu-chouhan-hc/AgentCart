import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Package } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatCurrency = (value: number | string | null | undefined) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const Orders = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("agentcart_token") ||
          localStorage.getItem("token") ||
          "";

        if (!token) {
          navigate("/login");
          return;
        }

        if (orderId) {
          const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload?.message || "Failed to fetch order");
          }

          setOrderData(payload.data);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "Failed to fetch orders");
        }

        setOrders(payload.data || []);
      } catch (err: any) {
        console.error("Fetch order error:", err);
        setError(err.message || "Unable to load order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                AgentCart
              </p>
              <h1 className="text-3xl font-bold">
                {orderId ? "Order Details" : "My Orders"}
              </h1>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-10 text-center">
            <Package size={45} className="mx-auto animate-pulse text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">
              Loading your orders...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!orderId) {
    if (error) {
      return (
        <main className="min-h-screen bg-[#fafafa] px-5 py-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  AgentCart
                </p>
                <h1 className="text-3xl font-bold">My Orders</h1>
              </div>
            </div>

            <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-10 text-center">
              <Package size={50} className="mx-auto text-gray-300" />
              <h2 className="mt-4 text-xl font-bold">Unable to Load Orders</h2>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 rounded-xl bg-[#F4D000] px-6 py-3 font-bold text-[#111]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
      );
    }

    if (orders.length === 0) {
      return (
        <main className="min-h-screen bg-[#fafafa] px-5 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  AgentCart
                </p>
                <h1 className="text-3xl font-bold">My Orders</h1>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 text-center">
              <Package size={40} className="mx-auto text-gray-300" />
              <h2 className="mt-4 text-xl font-bold">No orders yet</h2>
              <p className="mt-2 text-sm text-gray-500">
                Place your first order to see it here.
              </p>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="mt-6 rounded-xl bg-[#F4D000] px-6 py-3 font-bold text-[#111]"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                AgentCart
              </p>
              <h1 className="text-3xl font-bold">My Orders</h1>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const items = order.items || [];
              const firstItem = items[0]?.product;

              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-gray-900">
                        {firstItem?.name || "Order items"}
                      </h2>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#111]">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
                      {order.status || "PENDING"}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {items.length} item{items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  if (!orderData) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                AgentCart
              </p>
              <h1 className="text-3xl font-bold">Order Details</h1>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-10 text-center">
            <Package size={50} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-bold">Unable to Load Order</h2>
            <p className="mt-2 text-sm text-gray-500">
              {error || "Order not found."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-[#F4D000] px-6 py-3 font-bold text-[#111]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  const items = orderData.items || [];
  const totalAmount = orderData.totalAmount ?? orderData.total ?? 0;

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Go to home"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              AgentCart
            </p>
            <h1 className="text-3xl font-bold">Order Details</h1>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4 rounded-3xl border border-green-200 bg-green-50 p-6">
            <CheckCircle2 size={35} className="shrink-0 text-green-600" />
            <div>
              <h2 className="text-lg font-bold text-green-900">
                Order Placed Successfully!
              </h2>
              <p className="text-sm text-green-700">
                Your order status is currently{" "}
                <span className="font-semibold uppercase">
                  {orderData.status || "PENDING"}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6">
            <div className="flex justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Order ID</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {orderData.id || orderData._id || "N/A"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold uppercase text-gray-400">Total</p>
                <p className="mt-1 text-2xl font-black text-[#111]">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <span className="text-sm font-semibold text-gray-600">Order Status</span>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase text-yellow-800">
                {orderData.status || "PENDING"}
              </span>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase text-gray-400">Ordered Items</p>

              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500">No items found.</p>
                ) : (
                  items.map((item: any, index: number) => {
                    const product = item.product || {};
                    const unitPrice = Number(item.price ?? product.price ?? 0);
                    const quantity = Number(item.quantity ?? 1);
                    const lineTotal = unitPrice * quantity;

                    return (
                      <div
                        key={item.id || item.productId || `${product.id || "product"}-${index}`}
                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name || item.productName || `Item ${index + 1}`}
                          </p>
                          {item.productId && (
                            <p className="mt-1 text-xs text-gray-400">
                              Product ID: {item.productId}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">Qty: {quantity}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatCurrency(unitPrice)} each
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#111]">
                            {formatCurrency(lineTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {orderData.address && (
              <div className="border-t border-gray-100 pt-5">
                <p className="mb-1 text-xs font-bold uppercase text-gray-400">
                  Shipping Address
                </p>
                <p className="text-sm font-semibold">
                  {orderData.address.fullName || orderData.address.name || "Customer"}
                  {orderData.address.phone && ` (${orderData.address.phone})`}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {orderData.address.addressLine1 && `${orderData.address.addressLine1}, `}
                  {orderData.address.addressLine2 && `${orderData.address.addressLine2}, `}
                  {orderData.address.city && `${orderData.address.city}, `}
                  {orderData.address.state && `${orderData.address.state} - `}
                  {orderData.address.postalCode || ""}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-xl bg-[#111] px-5 py-4 text-sm font-bold text-white transition hover:bg-black"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
};

export default Orders;