
"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


type Product = {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  lastSoldAt: string | null;
};

export default function DeadStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeadStock();
  }, []);

  const fetchDeadStock = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products/dead-stock`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch dead stock");
      }

      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDaysSinceLastSale = (lastSoldAt: string | null) => {
    if (!lastSoldAt) return "Never sold";
    
    const lastSale = new Date(lastSoldAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastSale.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days ago`;
  };

  const getStockValue = (product: Product) => {
    return product.quantity * product.price;
  };

  const totalDeadStockValue = products.reduce((sum, p) => sum + getStockValue(p), 0);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <div style={{
          padding: 20,
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: 8,
          border: "1px solid #fca5a5"
        }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchDeadStock}
            style={{
              marginTop: 15,
              padding: "10px 20px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ marginBottom: 10 }}><b>Dead Stock Report</b></h1>
        <p style={{ color: "#6b7280" }}>
          Products with no sales in the last 30 days. Consider discounting or discontinuing.
        </p>
      </div>

      {products.length === 0 ? (
        <div style={{
          padding: 60,
          textAlign: "center",
          background: "#f9fafb",
          borderRadius: 8,
          border: "1px solid #e5e7eb"
        }}>
          <div style={{ fontSize: 48, marginBottom: 15 }}>🎉</div>
          <h2 style={{ marginBottom: 10 }}>Great Job!</h2>
          <p style={{ color: "#6b7280" }}>
            No dead stock found. All products are moving well!
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
            marginBottom: 30
          }}>
            <div style={{
              padding: 20,
              background: "#fee2e2",
              borderRadius: 8,
              border: "1px solid #fca5a5"
            }}>
              <h3 style={{ margin: 0, color: "#991b1b", fontSize: 14 }}>
                Dead Stock Items
              </h3>
              <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0", color: "#dc2626" }}>
                {products.length}
              </p>
            </div>

            <div style={{
              padding: 20,
              background: "#fef3c7",
              borderRadius: 8,
              border: "1px solid #fde047"
            }}>
              <h3 style={{ margin: 0, color: "#92400e", fontSize: 14 }}>
                Locked Capital
              </h3>
              <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0", color: "#f59e0b" }}>
                ₹{totalDeadStockValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={{ padding: 15, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                    Product Name
                  </th>
                  <th style={{ padding: 15, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                    SKU
                  </th>
                  <th style={{ padding: 15, textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>
                    Quantity
                  </th>
                  <th style={{ padding: 15, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>
                    Unit Price
                  </th>
                  <th style={{ padding: 15, textAlign: "right", borderBottom: "2px solid #e5e7eb" }}>
                    Stock Value
                  </th>
                  <th style={{ padding: 15, textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                    Last Sale
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const stockValue = getStockValue(product);
                  const lastSale = getDaysSinceLastSale(product.lastSoldAt);

                  return (
                    <tr key={product._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: 15 }}>
                        <strong>{product.name}</strong>
                      </td>
                      <td style={{ padding: 15, color: "#6b7280" }}>
                        {product.sku}
                      </td>
                      <td style={{
                        padding: 15,
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#dc2626"
                      }}>
                        {product.quantity}
                      </td>
                      <td style={{ padding: 15, textAlign: "right" }}>
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td style={{
                        padding: 15,
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "#f59e0b"
                      }}>
                        ₹{stockValue.toLocaleString()}
                      </td>
                      <td style={{ padding: 15, color: "#6b7280" }}>
                        {lastSale}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: 30,
            padding: 20,
            background: "#fef3c7",
            borderRadius: 8,
            border: "1px solid #fde047"
          }}>
            <h3 style={{ marginBottom: 15, color: "#92400e" }}>
              Recommended Actions to Clear Dead Stock
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <div>
                <h4 style={{ marginBottom: 8, fontSize: 16 }}>Short-term</h4>
                <ul style={{ marginLeft: 20, color: "#374151" }}>
                  <li style={{ marginBottom: 6 }}>Offer 20-30% discount</li>
                  <li style={{ marginBottom: 6 }}>Bundle with fast-moving items</li>
                  <li style={{ marginBottom: 6 }}>Run targeted promotions</li>
                </ul>
              </div>

              <div>
                <h4 style={{ marginBottom: 8, fontSize: 16 }}>Long-term</h4>
                <ul style={{ marginLeft: 20, color: "#374151" }}>
                  <li style={{ marginBottom: 6 }}>Discontinue lowest performers</li>
                  <li style={{ marginBottom: 6 }}>Adjust purchasing patterns</li>
                  <li style={{ marginBottom: 6 }}>Liquidate through B2B channels</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}