"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Package, TrendingDown, ArrowRight } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  reorderLevel: number;
}

export default function LowStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/low-stock`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch low stock products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "#dc2626", bg: "#fee2e2" };
    if (quantity <= reorderLevel * 0.5) return { label: "Critical", color: "#ea580c", bg: "#ffedd5" };
    return { label: "Low Stock", color: "#f59e0b", bg: "#fef3c7" };
  };

  return (
    <div style={{ 
      padding: "40px 20px", 
      maxWidth: 1400, 
      margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <AlertTriangle size={32} color="#f59e0b" />
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            Low Stock Products
          </h1>
        </div>
        <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
          Products that need immediate reordering to avoid stockouts
        </p>
      </div>

      {/* Stats Card */}
      <div style={{
        padding: 24,
        background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
        borderRadius: 12,
        border: "2px solid #fbbf24",
        marginBottom: 30,
        display: "flex",
        alignItems: "center",
        gap: 20
      }}>
        <div style={{
          width: 60,
          height: 60,
          background: "white",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Package size={32} color="#f59e0b" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: "#92400e", marginBottom: 4, fontWeight: 600 }}>
            Items Requiring Attention
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#78350f" }}>
            {products.length}
          </div>
        </div>
        {products.length > 0 && (
          <div style={{
            padding: "10px 20px",
            background: "white",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#92400e"
          }}>
            Action Required
          </div>
        )}
      </div>

      {loading && (
        <div style={{ 
          padding: 60, 
          textAlign: "center",
          background: "#f9fafb",
          borderRadius: 12,
          border: "1px solid #e5e7eb"
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #f59e0b",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#6b7280", margin: 0 }}>Loading products...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}


      {!loading && products.length === 0 && (
        <div style={{
          padding: 60,
          textAlign: "center",
          background: "#f0fdf4",
          borderRadius: 12,
          border: "2px dashed #86efac"
        }}>
          <div style={{
            width: 80,
            height: 80,
            background: "#dcfce7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <Package size={40} color="#22c55e" />
          </div>
          <h3 style={{ color: "#166534", marginBottom: 8, fontSize: 24 }}>
            All Stock Levels Good! 🎉
          </h3>
          <p style={{ color: "#16a34a", margin: 0, fontSize: 16 }}>
            No products are running low at the moment. Great job managing your inventory!
          </p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div style={{ 
          display: "grid", 
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))"
        }}>
          {products.map(product => {
            const status = getStockStatus(product.quantity, product.reorderLevel);
            const stockPercentage = (product.quantity / product.reorderLevel) * 100;
            
            return (
              <div
                key={product._id}
                style={{
                  background: "white",
                  border: `2px solid ${status.color}20`,
                  borderRadius: 12,
                  padding: 20,
                  transition: "all 0.2s",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${status.color}30`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 16
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: 18, 
                      fontWeight: 700,
                      color: "#1f2937",
                      marginBottom: 4
                    }}>
                      {product.name}
                    </h3>
                    <div style={{ 
                      fontSize: 13,
                      color: "#6b7280",
                      fontFamily: "monospace",
                      fontWeight: 600
                    }}>
                      SKU: {product.sku}
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 12px",
                    background: status.bg,
                    color: status.color,
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    flexShrink: 0
                  }}>
                    {status.label}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8
                  }}>
                    <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                      Stock Level
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: status.color }}>
                      {product.quantity} / {product.reorderLevel}
                    </span>
                  </div>
                  <div style={{
                    height: 8,
                    background: "#e5e7eb",
                    borderRadius: 4,
                    overflow: "hidden"
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${Math.min(stockPercentage, 100)}%`,
                      background: `linear-gradient(90deg, ${status.color} 0%, ${status.color}cc 100%)`,
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  paddingTop: 16,
                  borderTop: "1px solid #e5e7eb"
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                      Current Stock
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>
                      {product.quantity}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                      Reorder Level
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>
                      {product.reorderLevel}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                      Unit Price
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                      Stock Value
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>
                      ₹{(product.quantity * product.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {product.quantity <= product.reorderLevel * 0.5 && (
                  <div style={{
                    marginTop: 16,
                    padding: 12,
                    background: status.bg,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <TrendingDown size={16} color={status.color} />
                    <span style={{ 
                      fontSize: 13, 
                      fontWeight: 600, 
                      color: status.color,
                      flex: 1
                    }}>
                      {product.quantity === 0 
                        ? "URGENT: Reorder immediately" 
                        : "Reorder soon to avoid stockout"}
                    </span>
                    <ArrowRight size={16} color={status.color} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}