"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


type Product = {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  reorderLevel: number;
};

export default function SearchFilter() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchProducts();
  }, [status, sortBy]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (status !== "all") params.append("status", status);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`${API_BASE_URL}/api/products/search?${params}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts();
  };

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 30 }}>🔍 Search & Filter Inventory</h1>

      <div style={{
        background: "white",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: 30
      }}>
        <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name or SKU..."
              style={{
                flex: 1,
                padding: 12,
                fontSize: 16,
                border: "1px solid #d1d5db",
                borderRadius: 8
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 30px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Search
            </button>
          </div>
        </form>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", fontSize: 14 }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                fontSize: 14,
                border: "1px solid #d1d5db",
                borderRadius: 6
              }}
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", fontSize: 14 }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                fontSize: 14,
                border: "1px solid #d1d5db",
                borderRadius: 6
              }}
            >
              <option value="name">Name (A-Z)</option>
              <option value="quantity-asc">Quantity (Low to High)</option>
              <option value="quantity-desc">Quantity (High to Low)</option>
              <option value="value-desc">Stock Value (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{
        background: "white",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Results ({products.length})</h2>
          {loading && <span style={{ color: "#6b7280" }}>Loading...</span>}
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                    Product
                  </th>
                  <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                    SKU
                  </th>
                  <th style={{ padding: 12, textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>
                    Quantity
                  </th>
                  <th style={{ padding: 12, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>
                    Price
                  </th>
                  <th style={{ padding: 12, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>
                    Stock Value
                  </th>
                  <th style={{ padding: 12, textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isLowStock = p.quantity <= p.reorderLevel;
                  const isOutOfStock = p.quantity === 0;
                  const stockValue = p.quantity * p.price;

                  return (
                    <tr key={p._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: 12 }}>
                        <strong>{p.name}</strong>
                      </td>
                      <td style={{ padding: 12, color: "#6b7280", fontFamily: "monospace" }}>
                        {p.sku}
                      </td>
                      <td style={{
                        padding: 12,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 16,
                        color: isOutOfStock ? "#dc2626" : isLowStock ? "#f59e0b" : "#16a34a"
                      }}>
                        {p.quantity}
                      </td>
                      <td style={{ padding: 12, textAlign: "right" }}>
                        ₹{p.price.toLocaleString()}
                      </td>
                      <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                        ₹{stockValue.toLocaleString()}
                      </td>
                      <td style={{ padding: 12, textAlign: "center" }}>
                        {isOutOfStock ? (
                          <span style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: "bold"
                          }}>
                            OUT OF STOCK
                          </span>
                        ) : isLowStock ? (
                          <span style={{
                            background: "#fef3c7",
                            color: "#92400e",
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
    </div>
  );
}