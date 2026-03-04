import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Sparkles } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const statusIcon: Record<string, any> = { Processing: Package, Shipped: Truck, Delivered: CheckCircle, Cancelled: XCircle };
const statusColor: Record<string, string> = { Processing: "text-gold", Shipped: "text-blue-500", Delivered: "text-green-600", Cancelled: "text-red-500" };

interface OrderItem {
  product: string;
  title: string;
  qty: number;
  price: number;
  image: string;
  _id: string;
}

interface OrderType {
  _id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://sakshi-freg-backend.onrender.com/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          toast.error(data.message || "Failed to load orders");
        }
      } catch (error) {
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <>
      <section className="relative gradient-hero py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-10 bg-gold/60" />
            <Sparkles className="w-4 h-4 text-gold" />
            <div className="h-px w-10 bg-gold/60" />
          </div>
          <h1 className="text-3xl font-heading font-bold">My Orders</h1>
        </div>
      </section>
      <SectionWrapper>
        <div className="container mx-auto px-4 min-h-[50vh]">
          {loading ? (
            <p className="text-center text-muted-foreground mt-10">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-heading mb-2">No orders found</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders yet.</p>
              <Link to="/shop" className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:shadow-warm transition-all">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {orders.map((order, i) => {
                const Icon = statusIcon[order.status] || Package;
                return (
                  <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 hover:shadow-elevated transition-shadow duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-border/50 pb-3">
                      <div>
                        <p className="font-heading font-semibold text-sm text-muted-foreground">Order #{order._id}</p>
                        <p className="text-sm text-foreground/80">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/50 ${statusColor[order.status]}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{order.status}</span>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      {order.orderItems.map((item) => (
                        <div key={item._id} className="flex items-center gap-4">
                          <img src={item.image.startsWith('/') && !item.image.startsWith('http') ? `https://sakshi-freg-backend.onrender.com${item.image}` : item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-border/30" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.qty} × ₹{item.price}</p>
                          </div>
                          <p className="font-medium">₹{item.qty * item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <p className="text-muted-foreground text-sm">Total Paid</p>
                      <p className="font-heading font-bold text-lg text-primary">₹{order.totalPrice}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Orders;
