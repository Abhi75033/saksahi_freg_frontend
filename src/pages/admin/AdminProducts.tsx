import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Product } from "@/data/products";

const AdminProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const bodyFormData = new FormData();
        bodyFormData.append("image", file);
        setUploading(true);

        try {
            const res = await fetch("http://localhost:5001/api/upload", {
                method: "POST",
                body: bodyFormData,
            });
            const data = await res.json();
            setFormData({ ...formData, image: data.image });
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            toast.error("Please provide an image url or upload an image");
            return;
        }

        try {
            if (editingId) {
                await fetch(`http://localhost:5001/api/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success("Product updated");
      } else {
        await fetch("http://localhost:5001/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(formData),
        });
        toast.success("Product created");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(editingId ? "Update failed" : "Creation failed");
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`http://localhost:5001/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        toast.success("Product deleted");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", price: "", category: "", image: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p._id);
    setFormData({ title: p.title, description: p.description, price: p.price, category: p.category, image: p.image });
    setIsModalOpen(true);
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold">Manage Products</h2>
        <button onClick={openAddModal} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:shadow-warm transition-all">
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50">
              <th className="p-3">IMAGE</th>
              <th className="p-3">NAME</th>
              <th className="p-3">PRICE</th>
              <th className="p-3">CATEGORY</th>
              <th className="p-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p._id || p.id} className="border-b border-border/50">
                <td className="p-3">
                  <img src={p.image.startsWith('/') && !p.image.startsWith('http') ? `http://localhost:5001${p.image}` : p.image} alt={p.title || p.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-3 text-sm font-medium">{p.title || p.name}</td>
                <td className="p-3 text-sm">₹{p.price}</td>
                <td className="p-3 text-sm">{p.category}</td>
                <td className="p-3 text-sm flex gap-2">
                  <button onClick={() => openEditModal(p)} className="px-3 py-1 bg-secondary text-foreground text-xs rounded hover:bg-secondary/80">Edit</button>
                  <button onClick={() => deleteHandler(p._id || p.id)} className="px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs rounded hover:opacity-80">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-2xl w-full max-w-md p-6 shadow-elevated">
            <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 rounded border border-border/50 bg-secondary/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Price</label>
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} required className="w-full px-3 py-2 rounded border border-border/50 bg-secondary/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <input name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 rounded border border-border/50 bg-secondary/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 rounded border border-border/50 bg-secondary/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Image URL or Upload</label>
                <input name="image" value={formData.image} onChange={handleInputChange} placeholder="URL like /placeholder.svg or use upload below" className="w-full px-3 py-2 mb-2 rounded border border-border/50 bg-secondary/50" />
                <input type="file" onChange={uploadFileHandler} className="w-full text-sm" />
                {uploading && <span className="text-xs text-primary">Uploading...</span>}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">{editingId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
