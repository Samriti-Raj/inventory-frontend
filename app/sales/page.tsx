"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


type SalesSummary = {
  totalSales: number;
  totalRevenue: number;
  totalUnits: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sku: string;
    quantity: number;
    revenue: number;
  }>;
  period: string;
};

type Product = {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

export default function SalesTracking() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [saleQuantity, setSaleQuantity] = useState("1");
  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/sales/summary?days=${period}`),
        fetch(`${API_BASE_URL}/api/products`)
      ]);

      const summaryData = await summaryRes.json();
      const productsData = await productsRes.json();

      setSummary(summaryData);
      setProducts(productsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const recordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const product = products.find(p => p._id === selectedProduct);
      if (!product) return;

      const response = await fetch(`${API_BASE_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          quantity: Number(saleQuantity),
          price: product.price
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setMessage("Sale recorded successfully!");
      setShowSaleForm(false);
      setSelectedProduct("");
      setSaleQuantity("1");
      fetchData();

      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage(`${error.message}`);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1>💰 Sales Tracking</h1>
        <button
          onClick={() => setShowSaleForm(!showSaleForm)}
          style={{
            padding: "12px 24px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {showSaleForm ? "Cancel" : "+ Record Sale"}
        </button>
      </div>

      {message && (
        <div style={{
          padding: 15,
          marginBottom: 20,
          background: message.startsWith("") ? "#dcfce7" : "#fee2e2",
          color: message.startsWith("") ? "#15803d" : "#991b1b",
          borderRadius: 8,
          border: `1px solid ${message.startsWith("") ? "#86efac" : "#fca5a5"}`
        }}>
          {message}
        </div>
      )}

      {showSaleForm && (
        <div style={{
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: 30
        }}>
          <h2 style={{ marginBottom: 20 }}>Record New Sale</h2>
          <form onSubmit={recordSale}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
                Select Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  fontSize: 16,
                  border: "1px solid #d1d5db",
                  borderRadius: 8
                }}
              >
                <option value="">-- Choose a product --</option>
                {products.filter(p => p.quantity > 0).map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.sku}) - ₹{p.price} - Stock: {p.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={saleQuantity}
                onChange={(e) => setSaleQuantity(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  fontSize: 16,
                  border: "1px solid #d1d5db",
                  borderRadius: 8
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedProduct}
              style={{
                width: "100%",
                padding: 15,
                background: selectedProduct ? "#16a34a" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
                cursor: selectedProduct ? "pointer" : "not-allowed"
              }}
            >
              Record Sale
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 30 }}>
        <label style={{ marginRight: 15, fontWeight: "bold" }}>Show data for:</label>
        {["7", "30", "90"].map(days => (
          <button
            key={days}
            onClick={() => setPeriod(days)}
            style={{
              padding: "8px 16px",
              marginRight: 10,
              background: period === days ? "#2563eb" : "#e5e7eb",
              color: period === days ? "white" : "#374151",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Last {days} days
          </button>
        ))}
      </div>

      {summary && (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 30
          }}>
            <div style={{
              padding: 25,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>Total Sales</h3>
              <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>
                {summary.totalSales}
              </p>
              <small style={{ color: "#6b7280" }}>transactions</small>
            </div>

            <div style={{
              padding: 25,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>Total Revenue</h3>
              <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0", color: "#16a34a" }}>
                ₹{(summary.totalRevenue / 1000).toFixed(1)}K
              </p>
              <small style={{ color: "#6b7280" }}>{summary.period}</small>
            </div>

            <div style={{
              padding: 25,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>Units Sold</h3>
              <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>
                {summary.totalUnits}
              </p>
              <small style={{ color: "#6b7280" }}>total units</small>
            </div>

            <div style={{
              padding: 25,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>Avg Order Value</h3>
              <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>
                ₹{summary.averageOrderValue.toFixed(0)}
              </p>
              <small style={{ color: "#6b7280" }}>per transaction</small>
            </div>
          </div>

          {/* Top Products */}
          <div style={{
            background: "white",
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ marginBottom: 20 }}>🏆 Top Selling Products</h2>
            
            {summary.topProducts.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>
                No sales recorded in this period
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th style={{ padding: 12, textAlign: "left" }}>Rank</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Product</th>
                    <th style={{ padding: 12, textAlign: "left" }}>SKU</th>
                    <th style={{ padding: 12, textAlign: "center" }}>Units Sold</th>
                    <th style={{ padding: 12, textAlign: "right" }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topProducts.map((product, index) => (
                    <tr key={product.sku} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: 12 }}>
                        <span style={{
                          background: index === 0 ? "#fbbf24" : index === 1 ? "#d1d5db" : index === 2 ? "#cd7f32" : "#e5e7eb",
                          color: index < 3 ? "white" : "#374151",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontWeight: "bold"
                        }}>
                          #{index + 1}
                        </span>
                      </td>
                      <td style={{ padding: 12, fontWeight: "bold" }}>{product.name}</td>
                      <td style={{ padding: 12, color: "#6b7280", fontFamily: "monospace" }}>
                        {product.sku}
                      </td>
                      <td style={{ padding: 12, textAlign: "center", fontWeight: "bold" }}>
                        {product.quantity}
                      </td>
                      <td style={{ padding: 12, textAlign: "right", fontWeight: "bold", color: "#16a34a" }}>
                        ₹{product.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}