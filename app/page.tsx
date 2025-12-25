"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


type Product = {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  reorderLevel?: number;
  lastSoldAt?: string;
};

type Stats = {
  totalProducts: number;
  lowStockCount: number;
  deadStockCount: number;
  totalValue: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/products/stats`)
      ]);

      if (!productsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const productsData = await productsRes.json();
      const statsData = await statsRes.json();

      setProducts(productsData);
      setStats(statsData);
      setError("");
    } catch (err) {
      setError("Unable to connect to server. Make sure backend is running on port 5000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 30 }}><b>Inventory Dashboard</b></h1>

      {stats && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: 20, 
          marginBottom: 30 
        }}>
          <div style={{ 
            padding: 20, 
            background: "#f0f9ff", 
            borderRadius: 8, 
            border: "1px solid #bae6fd" 
          }}>
            <h3 style={{ margin: 0, color: "#0369a1" }}>Total Products</h3>
            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>
              {stats.totalProducts}
            </p>
          </div>

          <div style={{ 
            padding: 20, 
            background: "#fef9c3", 
            borderRadius: 8, 
            border: "1px solid #fde047" 
          }}>
            <h3 style={{ margin: 0, color: "#a16207" }}>Low Stock Items</h3>
            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>
              {stats.lowStockCount}
            </p>
          </div>

          <div style={{ 
            padding: 20, 
            background: "#fee2e2", 
            borderRadius: 8, 
            border: "1px solid #fca5a5" 
          }}>
            <h3 style={{ margin: 0, color: "#991b1b" }}>Dead Stock</h3>
            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>
              {stats.deadStockCount}
            </p>
          </div>

          <div style={{ 
            padding: 20, 
            background: "#dcfce7", 
            borderRadius: 8, 
            border: "1px solid #86efac" 
          }}>
            <h3 style={{ margin: 0, color: "#15803d" }}>Total Value</h3>
            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>
              ₹{stats.totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: 15 }}>All Products</h2>
      
      {products.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", padding: 40 }}>
          No products found. Add your first product to get started!
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Name</th>
                <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>SKU</th>
                <th style={{ padding: 12, textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>Quantity</th>
                <th style={{ padding: 12, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Price</th>
                <th style={{ padding: 12, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>Value</th>
                <th style={{ padding: 12, textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => {
                const isLowStock = p.reorderLevel ? p.quantity <= p.reorderLevel : p.quantity < 10;
                const totalValue = p.quantity * p.price;

                return (
                  <tr key={p._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: 12 }}>{p.name}</td>
                    <td style={{ padding: 12, color: "#6b7280" }}>{p.sku}</td>
                    <td style={{ 
                      padding: 12, 
                      textAlign: "center",
                      fontWeight: "bold",
                      color: isLowStock ? "#dc2626" : "#16a34a"
                    }}>
                      {p.quantity}
                    </td>
                    <td style={{ padding: 12, textAlign: "right" }}>₹{p.price.toLocaleString()}</td>
                    <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                      ₹{totalValue.toLocaleString()}
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      {isLowStock ? (
                        <span style={{ 
                          background: "#fee2e2", 
                          color: "#991b1b", 
                          padding: "4px 8px", 
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: "bold"
                        }}>
                          LOW STOCK
                        </span>
                      ) : (
                        <span style={{ 
                          background: "#dcfce7", 
                          color: "#15803d", 
                          padding: "4px 8px", 
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: "bold"
                        }}>
                          IN STOCK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

