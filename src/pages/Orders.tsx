import { dummyOrders } from "@/data/products";
import { Package, Truck, CheckCircle, Sparkles } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { motion } from "framer-motion";

const statusIcon = { Processing: Package, Shipped: Truck, Delivered: CheckCircle };
const statusColor = { Processing: "text-gold", Shipped: "text-primary", Delivered: "text-green-600" };

const Orders = () => (
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
      <div className="container mx-auto px-4">
        <div className="space-y-4">
          {dummyOrders.map((order, i) => {
            const Icon = statusIcon[order.status];
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 hover:shadow-elevated transition-shadow duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-heading font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${statusColor[order.status]}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{order.status}</span>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                  {order.items.map(item => (
                    <p key={item.product.id}>{item.product.name} × {item.quantity}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-heading font-bold">₹{order.total}</p>
                  <button className="px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300">Track Order</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  </>
);

export default Orders;
