
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


export default function AddProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    reorderLevel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          quantity: Number(form.quantity),
          price: Number(form.price),
          reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : 10,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      setSuccess(true);
      setForm({ name: "", sku: "", quantity: "", price: "", reorderLevel: "" });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 30 }}>➕ Add New Product</h1>

      {error && (
        <div style={{
          padding: 15,
          marginBottom: 20,
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: 8,
          border: "1px solid #fca5a5"
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: 15,
          marginBottom: 20,
          background: "#dcfce7",
          color: "#15803d",
          borderRadius: 8,
          border: "1px solid #86efac"
        }}>
          Product added successfully! Redirecting to dashboard...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Product Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Ceramic Floor Tiles 60x60"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            SKU (Stock Keeping Unit) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., CFT-001"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              boxSizing: "border-box"
            }}
          />
          <small style={{ color: "#6b7280" }}>Must be unique</small>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Quantity *
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="0"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              style={{
                width: "100%",
                padding: 12,
                fontSize: 16,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Price (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={{
                width: "100%",
                padding: 12,
                fontSize: 16,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 30 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Reorder Level (Optional)
          </label>
          <input
            type="number"
            min="0"
            placeholder="10 (default)"
            value={form.reorderLevel}
            onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              boxSizing: "border-box"
            }}
          />
          <small style={{ color: "#6b7280" }}>
            Alert when quantity falls below this level
          </small>
        </div>

        <div style={{ display: "flex", gap: 15 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: 15,
              fontSize: 16,
              fontWeight: "bold",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              padding: 15,
              fontSize: 16,
              background: "white",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}