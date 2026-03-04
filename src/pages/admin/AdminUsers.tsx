import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/users", {
                    headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50">
              <th className="p-3">ID</th>
              <th className="p-3">NAME</th>
              <th className="p-3">EMAIL</th>
              <th className="p-3">ROLE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-border/50">
                <td className="p-3 text-sm text-muted-foreground">{u._id}</td>
                <td className="p-3 text-sm font-medium">{u.name}</td>
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
