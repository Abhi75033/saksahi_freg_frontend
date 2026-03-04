import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AdminOrder {
    _id: string;
    user: { name: string };
    totalPrice: number;
    isPaid: boolean;
    status: string;
    createdAt: string;
}

const AdminOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/orders", {
                headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:5001/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Manage Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50">
              <th className="p-3">ID</th>
              <th className="p-3">USER</th>
              <th className="p-3">DATE</th>
              <th className="p-3">TOTAL</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-border/50">
                <td className="p-3 text-sm text-muted-foreground">{o._id}</td>
                <td className="p-3 text-sm">{o.user?.name || 'Unknown'}</td>
                <td className="p-3 text-sm">{o.createdAt.substring(0, 10)}</td>
                <td className="p-3 text-sm font-medium">₹{o.totalPrice}</td>
                <td className="p-3 text-sm">{o.status}</td>
                <td className="p-3 text-sm">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="bg-transparent border border-border/50 rounded px-2 py-1 text-sm focus:outline-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
