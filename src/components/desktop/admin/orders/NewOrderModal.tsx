"use client";

import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { registerUser } from "../../../../../api/auth.api";
import { adminCreateOrder } from "../../../../../api/orders.api";
import { fetchAllProducts } from "../../../../../api/products.api";
import { fetchAllUsers } from "../../../../../api/users.api";
import { NewOrderStep, OrderItem } from "../../../../../types/orderConstants";
import {
  AdminCreateOrderPayload,
  OrderListType,
  PaymentMethod,
} from "../../../../../types/orderTypes";
import { Product } from "../../../../../types/productTypes";
import { User } from "../../../../../types/userTypes";

interface Props {
  onClose: () => void;
  onOrderCreated: (order: OrderListType) => void;
}

export default function NewOrderModal({ onClose, onOrderCreated }: Props) {
  const [step, setStep] = useState<NewOrderStep>("user");

  // Step 1 — user selection
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [newUserError, setNewUserError] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [createdPassword, setCreatedPassword] = useState("");

  // Step 2 — products
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Step 3 — details
  const [shippingAddress, setShippingAddress] = useState({
    province: "",
    district: "",
    ward: "",
    detail: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchAllProducts()]).then(([u, p]) => {
      setUsers(u.filter((user) => user.role === "PATIENT" && user.isActive));
      setProducts(p);
    });
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(userSearch.toLowerCase()),
      ),
    [users, userSearch],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()),
      ),
    [products, productSearch],
  );

  const handleCreateNewUser = async () => {
    const { fullName, email, phone, dob } = newUserForm;
    if (!fullName || !email || !phone || !dob) {
      setNewUserError("All fields are required.");
      return;
    }
    setCreatingUser(true);
    setNewUserError("");
    try {
      const password = "123456";
      const res = await registerUser({
        fullName,
        email,
        phone,
        dob,
        password,
        role: "PATIENT",
      });
      const created: User = {
        id: res.user.id,
        email: res.user.email,
        fullName: res.user.fullName,
        phone: res.user.phone,
        role: "PATIENT",
        isActive: res.user.isActive,
        createdAt: res.user.createdAt ?? "",
        updatedAt: res.user.updatedAt ?? "",
      };
      setUsers((prev) => [created, ...prev]);
      setSelectedUser(created);
      setCreatedPassword(password);
      setIsNewUser(false);
      setStep("products");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setNewUserError(typeof msg === "string" ? msg : "Failed to create user.");
    } finally {
      setCreatingUser(false);
    }
  };

  const addProductToOrder = useCallback((product: Product) => {
    if (!product.units?.length) return;
    const defaultUnit =
      product.units.find((u) => u.isDefault) ?? product.units[0];
    setOrderItems((prev) => {
      if (prev.find((i) => i.productId === product.id)) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitType: defaultUnit.unitType,
          quantity: "1",
          unitPrice: defaultUnit.price,
          availableUnits: product.units!.map((u) => ({
            unitType: u.unitType,
            price: u.price,
            isDefault: u.isDefault,
          })),
        },
      ];
    });
  }, []);

  const updateOrderItemUnit = useCallback((idx: number, unitType: string) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const unit = item.availableUnits.find((u) => u.unitType === unitType);
        return { ...item, unitType, unitPrice: unit?.price ?? item.unitPrice };
      }),
    );
  }, []);

  const updateOrderItemQty = useCallback((idx: number, qty: string) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item)),
    );
  }, []);

  const removeOrderItem = useCallback((idx: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const orderTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );

  const handleSubmitOrder = async () => {
    if (!selectedUser) return;
    const { province, district, ward, detail } = shippingAddress;
    if (!province || !district || !ward || !detail) {
      setSubmitError("All address fields are required.");
      return;
    }
    if (orderItems.length === 0) {
      setSubmitError("Add at least one product.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload: AdminCreateOrderPayload = {
        userId: selectedUser.id,
        shippingAddress,
        paymentMethod,
        items: orderItems.map((i) => ({
          productId: i.productId,
          unitType: i.unitType as "TABLET" | "BOX",
          quantity: i.quantity,
        })),
      };
      const created = await adminCreateOrder(payload);
      onOrderCreated(created);
      onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setSubmitError(typeof msg === "string" ? msg : "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              New Walk-in Order
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {(["user", "products", "details"] as NewOrderStep[]).map(
                (s, i) => (
                  <span key={s} className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${step === s ? "bg-success text-white" : "bg-secondary text-muted-foreground"}`}
                    >
                      {i + 1}.{" "}
                      {s === "user"
                        ? "Patient"
                        : s === "products"
                          ? "Products"
                          : "Details"}
                    </span>
                    {i < 2 && (
                      <span className="text-muted-foreground text-xs">›</span>
                    )}
                  </span>
                ),
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Step 1: Patient */}
          {step === "user" && (
            <div className="space-y-4">
              {!isNewUser ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                      placeholder="Search patient by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>

                  <div className="border rounded-lg divide-y max-h-52 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-muted-foreground">
                        No patients found.
                      </p>
                    ) : (
                      filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedUser(u)}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors ${selectedUser?.id === u.id ? "bg-success/10 font-semibold" : ""}`}
                        >
                          <span className="font-medium">{u.fullName}</span>
                          <span className="text-muted-foreground ml-2">
                            {u.email}
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setIsNewUser(true);
                      setSelectedUser(null);
                    }}
                    className="text-sm text-success hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Register new patient
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    New Patient Info
                  </p>
                  {(["fullName", "email", "phone", "dob"] as const).map(
                    (field) => (
                      <div key={field}>
                        <label className="block text-xs text-muted-foreground mb-1 capitalize">
                          {field === "dob"
                            ? "Date of Birth"
                            : field === "fullName"
                              ? "Full Name"
                              : field}
                        </label>
                        <input
                          type={
                            field === "dob"
                              ? "date"
                              : field === "email"
                                ? "email"
                                : "text"
                          }
                          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                          value={newUserForm[field]}
                          onChange={(e) =>
                            setNewUserForm((f) => ({
                              ...f,
                              [field]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ),
                  )}
                  {newUserError && (
                    <p className="text-sm text-red-600">{newUserError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsNewUser(false)}
                    >
                      Back
                    </Button>
                    <Button
                      className="bg-success hover:bg-success/90 text-white"
                      disabled={creatingUser}
                      onClick={handleCreateNewUser}
                    >
                      {creatingUser ? "Creating..." : "Create & Continue"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Products */}
          {step === "products" && (
            <div className="space-y-4">
              {createdPassword && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 text-sm">
                  <p className="font-semibold text-yellow-800">
                    New patient created — save this password:
                  </p>
                  <p className="font-mono text-yellow-900 mt-1 select-all">
                    {createdPassword}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    This will not be shown again.
                  </p>
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                  placeholder="Search product..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    No products found.
                  </p>
                ) : (
                  filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addProductToOrder(p)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors flex justify-between items-center"
                    >
                      <span className="font-medium">{p.name}</span>
                      <span className="text-success text-xs">
                        <Plus size={14} />
                      </span>
                    </button>
                  ))
                )}
              </div>

              {orderItems.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Product</th>
                        <th className="px-3 py-2 text-left">Unit</th>
                        <th className="px-3 py-2 text-right">Price</th>
                        <th className="px-3 py-2 text-center">Qty</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orderItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 font-medium">
                            {item.productName}
                          </td>
                          <td className="px-3 py-2">
                            {item.availableUnits.length > 1 ? (
                              <select
                                value={item.unitType}
                                onChange={(e) =>
                                  updateOrderItemUnit(idx, e.target.value)
                                }
                                className="border rounded px-1.5 py-1 text-sm outline-none focus:ring-1 focus:ring-success/20"
                              >
                                {item.availableUnits.map((u) => (
                                  <option key={u.unitType} value={u.unitType}>
                                    {u.unitType}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-muted-foreground">
                                {item.unitType}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">
                            {formatVND(item.unitPrice)}
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min="1"
                              className="w-16 border rounded px-2 py-1 text-sm text-center outline-none focus:ring-1 focus:ring-success/20"
                              value={item.quantity}
                              onChange={(e) =>
                                updateOrderItemQty(idx, e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => removeOrderItem(idx)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-4 py-2 bg-secondary text-right text-sm font-bold">
                    Total: {formatVND(orderTotal)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">
                Shipping Address
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["province", "district", "ward", "detail"] as const).map(
                  (field) => (
                    <div
                      key={field}
                      className={field === "detail" ? "col-span-2" : ""}
                    >
                      <label className="block text-xs text-muted-foreground mb-1 capitalize">
                        {field}
                      </label>
                      <input
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                        value={shippingAddress[field]}
                        onChange={(e) =>
                          setShippingAddress((a) => ({
                            ...a,
                            [field]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ),
                )}
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as PaymentMethod)
                  }
                >
                  {(
                    ["CASH", "CARD", "ONLINE", "INSURANCE"] as PaymentMethod[]
                  ).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-secondary rounded-lg p-3 text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Patient:</span>{" "}
                  <span className="font-medium">
                    {selectedUser?.fullName} ({selectedUser?.email})
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Items:</span>{" "}
                  <span className="font-medium">
                    {orderItems.length} product(s)
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Total:</span>{" "}
                  <span className="font-bold text-success">
                    {formatVND(orderTotal)}
                  </span>
                </p>
              </div>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex justify-between px-6 py-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (step === "user") onClose();
              else if (step === "products") setStep("user");
              else setStep("products");
            }}
          >
            {step === "user" ? "Cancel" : "Back"}
          </Button>
          <Button
            className="bg-success hover:bg-success/90 text-white"
            disabled={
              (step === "user" && !selectedUser) ||
              (step === "products" && orderItems.length === 0) ||
              submitting
            }
            onClick={() => {
              if (step === "user") setStep("products");
              else if (step === "products") setStep("details");
              else handleSubmitOrder();
            }}
          >
            {step === "details"
              ? submitting
                ? "Creating..."
                : "Create Order"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
