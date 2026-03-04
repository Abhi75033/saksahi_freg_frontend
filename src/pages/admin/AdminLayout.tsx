import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

const AdminLayout = () => {
    const location = useLocation();

    const links = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Products", path: "/admin/products", icon: <Package className="w-5 h-5" /> },
        { name: "Orders", path: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
        { name: "Users", path: "/admin/users", icon: <Users className="w-5 h-5" /> },
    ];

    return (
        <SectionWrapper className="pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="glass-card p-6 shadow-soft rounded-2xl sticky top-28">
                            <h2 className="font-heading font-bold text-xl mb-6 text-foreground/90">Admin Panel</h2>
                            <nav className="flex flex-col gap-2">
                                {links.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === link.path
                                                ? "bg-primary text-primary-foreground font-medium shadow-warm"
                                                : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                                            }`}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <div className="glass-card p-6 shadow-soft rounded-2xl min-h-[500px]">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AdminLayout;
