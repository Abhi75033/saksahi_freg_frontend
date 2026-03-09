import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Sparkles,
    MapPin,
    Pencil,
    Plus,
    ChevronRight,
    Trash2,
    Star,
    AlertCircle,
    ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SectionWrapper from "@/components/SectionWrapper";
import { toast } from "sonner";

const API = "https://sakshi-freg-backend.onrender.com/api";
const COD_LIMIT = 600;

interface Address {
    _id: string;
    label: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

type AddressPanel = "none" | "list" | "edit" | "add";

const emptyForm = () => ({
    label: "Home",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    isDefault: false,
});

const AddressForm = ({
    initial,
    onSave,
    onCancel,
    saving,
}: {
    initial: ReturnType<typeof emptyForm>;
    onSave: (data: ReturnType<typeof emptyForm>) => void;
    onCancel: () => void;
    saving: boolean;
}) => {
    const [form, setForm] = useState(initial);
    const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1 block">Label</label>
                    <select
                        value={form.label}
                        onChange={(e) => set("label", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                        {["Home", "Office", "Other"].map((l) => (
                            <option key={l}>{l}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1 block">Full Name</label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Recipient name" className="w-full px-3 py-2 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
            </div>
            <div>
                <label className="text-xs font-medium text-foreground/70 mb-1 block">Street / Full Address</label>
                <textarea value={form.street} onChange={(e) => set("street", e.target.value)} required rows={2} placeholder="House no., Street, Landmark" className="w-full px-3 py-2 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1 block">City</label>
                    <input value={form.city} onChange={(e) => set("city", e.target.value)} required placeholder="Mumbai" className="w-full px-3 py-2 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1 block">State</label>
                    <input value={form.state} onChange={(e) => set("state", e.target.value)} required placeholder="Maharashtra" className="w-full px-3 py-2 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1 block">Pincode</label>
                    <input value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} required placeholder="400001" className="w-full px-3 py-2 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1 block">Phone</label>
                    <input value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="+91 98765 43210" className="w-full px-3 py-2 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="accent-primary rounded" />
                <span className="text-foreground/70">Set as default address</span>
            </label>
            <div className="flex gap-3 pt-1">
                <button
                    type="button"
                    onClick={() => onSave(form)}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:shadow-warm transition-all hover:scale-[1.01] disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Address"}
                </button>
                <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-secondary/80 transition-all">
                    Cancel
                </button>
            </div>
        </div>
    );
};

const PaymentConfirmation = () => {
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddr, setSelectedAddr] = useState<Address | null>(null);
    const [addrPanel, setAddrPanel] = useState<AddressPanel>("none");
    const [editingAddr, setEditingAddr] = useState<Address | null>(null);
    const [saving, setSaving] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [placing, setPlacing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");

    const delivery = 49;
    const grandTotal = totalPrice + delivery;
    const codBlocked = grandTotal >= COD_LIMIT;

    // ------ Fetch addresses ------
    const fetchAddresses = async () => {
        if (!user?.token) return;
        setLoadingAddresses(true);
        try {
            const res = await fetch(`${API}/users/addresses`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAddresses(data);
            const def = data.find((a: Address) => a.isDefault) || data[0] || null;
            setSelectedAddr(def);
        } catch (e: any) {
            toast.error(e.message || "Failed to load addresses");
        } finally {
            setLoadingAddresses(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [user?.token]);

    // Auto-switch payment if COD becomes blocked
    useEffect(() => {
        if (codBlocked && paymentMethod === "Cash on Delivery") setPaymentMethod("UPI");
    }, [codBlocked, paymentMethod]);

    // ------ Address save/add ------
    const handleSaveAddress = async (form: ReturnType<typeof emptyForm>) => {
        setSaving(true);
        try {
            const isEditing = !!editingAddr;
            const url = isEditing
                ? `${API}/users/addresses/${editingAddr!._id}`
                : `${API}/users/addresses`;
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user!.token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAddresses(data);
            const def = data.find((a: Address) => a.isDefault) || data[0];
            setSelectedAddr(isEditing && editingAddr?._id === selectedAddr?._id ? data.find((a: Address) => a._id === editingAddr?._id) : selectedAddr || def);
            setAddrPanel("none");
            setEditingAddr(null);
            toast.success(isEditing ? "Address updated!" : "Address added!");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            const res = await fetch(`${API}/users/addresses/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user!.token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAddresses(data);
            if (selectedAddr?._id === id) {
                setSelectedAddr(data.find((a: Address) => a.isDefault) || data[0] || null);
            }
            toast.success("Address removed");
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const res = await fetch(`${API}/users/addresses/${id}/default`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${user!.token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAddresses(data);
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    // ------ Place Order ------
    const handlePlaceOrder = async () => {
        if (items.length === 0) { toast.error("Your cart is empty"); return; }
        if (!selectedAddr) { toast.error("Please add a delivery address"); return; }
        if (codBlocked && paymentMethod === "Cash on Delivery") {
            toast.error("COD not available for orders ₹600 or above");
            return;
        }

        setPlacing(true);
        const orderData = {
            orderItems: items.map((item) => ({
                title: item.product.name || item.product.title,
                qty: item.quantity,
                image: item.product.image,
                price: item.product.price,
                product: item.product.id || item.product._id,
            })),
            shippingAddress: {
                name: selectedAddr.name,
                street: selectedAddr.street,
                city: selectedAddr.city,
                state: selectedAddr.state,
                zipCode: selectedAddr.zipCode,
                country: selectedAddr.country,
                phone: selectedAddr.phone,
            },
            paymentMethod,
            totalPrice: grandTotal,
        };

        try {
            const res = await fetch(`${API}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user!.token}`,
                },
                body: JSON.stringify(orderData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to place order");
            setOrderId(data._id);
            setOrderPlaced(true);
            clearCart();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setPlacing(false);
        }
    };

    // ------ Order success ------
    if (orderPlaced)
        return (
            <SectionWrapper>
                <div className="container mx-auto px-4 text-center">
                    <div className="glass-card max-w-md mx-auto p-12 shadow-elevated relative overflow-hidden">
                        <div className="absolute inset-0 animate-shimmer" />
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="relative z-10">
                            <CheckCircle className="w-20 h-20 text-gold mx-auto mb-4" />
                        </motion.div>
                        <h1 className="text-3xl font-heading font-bold mb-2 relative z-10">Order Placed! 🎉</h1>
                        <p className="text-muted-foreground mb-2 relative z-10">Thank you for shopping with Sakhi Fragrance House</p>
                        <p className="text-sm font-medium text-primary mb-6 relative z-10">Order ID: {orderId}</p>
                        <Link to="/orders" className="relative z-10 inline-flex px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all">View Orders</Link>
                    </div>
                </div>
            </SectionWrapper>
        );

    // ------ Empty cart ------
    if (items.length === 0)
        return (
            <SectionWrapper>
                <div className="container mx-auto px-4 text-center">
                    <div className="glass-card max-w-md mx-auto p-12 shadow-elevated">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h1 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h1>
                        <p className="text-muted-foreground mb-6">Add some beautiful candles to checkout</p>
                        <Link to="/shop" className="inline-flex px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all hover:scale-[1.02]">Shop Now</Link>
                    </div>
                </div>
            </SectionWrapper>
        );

    return (
        <>
            {/* Hero */}
            <section className="relative gradient-hero py-10 md:py-14 overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="h-px w-10 bg-gold/60" />
                        <Sparkles className="w-4 h-4 text-gold" />
                        <div className="h-px w-10 bg-gold/60" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold">Confirm Your Order</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Review your order details before placing</p>
                </div>
            </section>

            <SectionWrapper>
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* ---- Left: Product Details ---- */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="glass-card p-6 hover:shadow-elevated transition-shadow duration-500">
                                <h2 className="font-heading font-semibold text-lg mb-5 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                    Order Items ({items.reduce((s, i) => s + i.quantity, 0)})
                                </h2>
                                <div className="space-y-3">
                                    {items.map((item) => {
                                        const pid = item.product.id || item.product._id;
                                        const pname = item.product.name || item.product.title;
                                        return (
                                            <motion.div
                                                key={pid}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0"
                                            >
                                                <div className="w-16 h-16 rounded-xl gradient-pink flex items-center justify-center shrink-0 relative overflow-hidden">
                                                    <div className="absolute inset-0 animate-shimmer" />
                                                    <span className="text-2xl relative z-10">🕯️</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-heading font-semibold text-sm truncate">{pname}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">₹{item.product.price} × {item.quantity}</p>
                                                </div>
                                                <p className="font-heading font-bold text-sm shrink-0">₹{item.product.price * item.quantity}</p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-border/40 space-y-1.5 text-sm">
                                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice}</span></div>
                                    <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>₹{delivery}</span></div>
                                    <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-border/40">
                                        <span>Grand Total</span>
                                        <span className="text-primary">₹{grandTotal}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="glass-card p-6 hover:shadow-elevated transition-shadow duration-500">
                                <h2 className="font-heading font-semibold text-lg mb-4">Payment Method</h2>
                                {codBlocked && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        COD is not available for orders of ₹{COD_LIMIT} or above. Please choose UPI or Credit Card.
                                    </motion.div>
                                )}
                                <div className="grid sm:grid-cols-3 gap-3">
                                    {[
                                        { id: "UPI", label: "UPI", icon: "📱" },
                                        { id: "Credit Card", label: "Credit Card", icon: "💳" },
                                        { id: "Cash on Delivery", label: "Cash on Delivery", icon: "💵" },
                                    ].map((m) => {
                                        const disabled = m.id === "Cash on Delivery" && codBlocked;
                                        return (
                                            <button
                                                key={m.id}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => !disabled && setPaymentMethod(m.id)}
                                                className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${paymentMethod === m.id
                                                        ? "border-primary bg-primary/8 shadow-warm"
                                                        : disabled
                                                            ? "border-border/30 opacity-40 cursor-not-allowed"
                                                            : "border-border/60 hover:border-primary/30"
                                                    }`}
                                            >
                                                <div className="text-xl mb-1">{m.icon}</div>
                                                {m.label}
                                                {disabled && <div className="text-[10px] text-muted-foreground mt-0.5">Above ₹{COD_LIMIT - 1}</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ---- Right: Address & Confirm ---- */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* Address card */}
                            <div className="glass-card p-6 shadow-elevated">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setAddrPanel(addrPanel === "none" ? "list" : "none")}
                                        className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                                    >
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                </div>

                                {/* Show current selected address */}
                                {loadingAddresses ? (
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-3 bg-border/40 rounded w-3/4" />
                                        <div className="h-3 bg-border/40 rounded w-1/2" />
                                        <div className="h-3 bg-border/40 rounded w-2/3" />
                                    </div>
                                ) : selectedAddr ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{selectedAddr.label}</span>
                                            {selectedAddr.isDefault && <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1"><Star className="w-2.5 h-2.5" /> Default</span>}
                                        </div>
                                        <p className="font-semibold text-sm">{selectedAddr.name}</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedAddr.street}, {selectedAddr.city}, {selectedAddr.state} – {selectedAddr.zipCode}</p>
                                        <p className="text-sm text-muted-foreground">{selectedAddr.country}</p>
                                        <p className="text-sm text-muted-foreground">{selectedAddr.phone}</p>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-4">
                                        <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-3">No address saved yet</p>
                                        <button
                                            type="button"
                                            onClick={() => { setEditingAddr(null); setAddrPanel("add"); }}
                                            className="text-sm text-primary font-medium hover:underline flex items-center gap-1 mx-auto"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add address
                                        </button>
                                    </div>
                                )}

                                {/* Address panel */}
                                <AnimatePresence>
                                    {addrPanel !== "none" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-5 pt-5 border-t border-border/40">
                                                {/* PANEL: address list */}
                                                {addrPanel === "list" && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-semibold text-foreground/80">Saved Addresses</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => { setEditingAddr(null); setAddrPanel("add"); }}
                                                                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                                                            >
                                                                <Plus className="w-3 h-3" /> Add New
                                                            </button>
                                                        </div>
                                                        {addresses.length === 0 && (
                                                            <p className="text-sm text-muted-foreground text-center py-3">No saved addresses</p>
                                                        )}
                                                        {addresses.map((addr) => (
                                                            <div
                                                                key={addr._id}
                                                                onClick={() => { setSelectedAddr(addr); setAddrPanel("none"); }}
                                                                className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${selectedAddr?._id === addr._id
                                                                        ? "border-primary bg-primary/5"
                                                                        : "border-border/40 hover:border-primary/30"
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                                            <span className="text-xs font-semibold text-primary">{addr.label}</span>
                                                                            {addr.isDefault && <Star className="w-3 h-3 text-amber-500" />}
                                                                        </div>
                                                                        <p className="text-xs font-medium">{addr.name}</p>
                                                                        <p className="text-xs text-muted-foreground truncate">{addr.street}, {addr.city}</p>
                                                                        <p className="text-xs text-muted-foreground">{addr.phone}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => { setEditingAddr(addr); setAddrPanel("edit"); }}
                                                                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                                                        >
                                                                            <Pencil className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        {!addr.isDefault && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleSetDefault(addr._id)}
                                                                                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-amber-500 transition-colors"
                                                                                title="Set as default"
                                                                            >
                                                                                <Star className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDeleteAddress(addr._id)}
                                                                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {selectedAddr?._id === addr._id && (
                                                                    <div className="mt-1.5 flex items-center gap-1 text-xs text-primary font-medium">
                                                                        <CheckCircle className="w-3 h-3" /> Selected
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* PANEL: edit existing */}
                                                {addrPanel === "edit" && editingAddr && (
                                                    <div>
                                                        <p className="text-sm font-semibold mb-4 text-foreground/80">Edit Address</p>
                                                        <AddressForm
                                                            initial={{
                                                                label: editingAddr.label,
                                                                name: editingAddr.name,
                                                                street: editingAddr.street,
                                                                city: editingAddr.city,
                                                                state: editingAddr.state,
                                                                zipCode: editingAddr.zipCode,
                                                                country: editingAddr.country,
                                                                phone: editingAddr.phone,
                                                                isDefault: editingAddr.isDefault,
                                                            }}
                                                            onSave={handleSaveAddress}
                                                            onCancel={() => { setAddrPanel("list"); setEditingAddr(null); }}
                                                            saving={saving}
                                                        />
                                                    </div>
                                                )}

                                                {/* PANEL: add new */}
                                                {addrPanel === "add" && (
                                                    <div>
                                                        <p className="text-sm font-semibold mb-4 text-foreground/80">Add New Address</p>
                                                        <AddressForm
                                                            initial={emptyForm()}
                                                            onSave={handleSaveAddress}
                                                            onCancel={() => setAddrPanel(addresses.length > 0 ? "list" : "none")}
                                                            saving={saving}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Place order */}
                            <div className="glass-card p-6 shadow-elevated">
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium">{paymentMethod}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Deliver to</span><span className="font-medium truncate max-w-[60%] text-right">{selectedAddr ? `${selectedAddr.city}, ${selectedAddr.state}` : "—"}</span></div>
                                    <div className="border-t border-border/40 pt-2 flex justify-between font-heading font-bold text-base">
                                        <span>Total</span>
                                        <span className="text-primary">₹{grandTotal}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePlaceOrder}
                                    disabled={placing || !selectedAddr}
                                    className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {placing ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            Place Order <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                                {!selectedAddr && (
                                    <p className="text-xs text-destructive text-center mt-2">Please add a delivery address to continue</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
};

export default PaymentConfirmation;
