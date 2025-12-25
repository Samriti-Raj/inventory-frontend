"use client";

import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, AlertTriangle, Package, DollarSign, BarChart3 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


type Product = {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  reorderLevel: number;
  lastSoldAt: string | null;
};

type Stats = {
  totalProducts: number;
  lowStockCount: number;
  deadStockCount: number;
  totalValue: number;
};

export default function AIInsights() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/products/stats`)
      ]);
      
      const productsData = await productsRes.json();
      const statsData = await statsRes.json();
      
      setProducts(productsData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const generateInsights = async () => {
    setLoading(true);
    setError("");
    setInsights("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate insights");
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating insights");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div style={{ 
      padding: "40px 20px", 
      maxWidth: 1200, 
      margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Sparkles size={32} color="#4285f4" />
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            AI Inventory Intelligence
          </h1>
        </div>
        <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
          Get data-driven recommendations powered by Google Gemini AI
        </p>
      </div>

      {stats && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 30
        }}>
          <StatCard
            icon={<Package size={24} />}
            label="Total Products"
            value={stats.totalProducts.toString()}
            color="#3b82f6"
          />
          <StatCard
            icon={<AlertTriangle size={24} />}
            label="Low Stock Items"
            value={stats.lowStockCount.toString()}
            color="#f59e0b"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Dead Stock Items"
            value={stats.deadStockCount.toString()}
            color="#ef4444"
          />
          <StatCard
            icon={<DollarSign size={24} />}
            label="Total Inventory Value"
            value={formatCurrency(stats.totalValue)}
            color="#10b981"
          />
        </div>
      )}

      <button
        onClick={generateInsights}
        disabled={loading || products.length === 0}
        style={{
          width: "100%",
          padding: "18px 30px",
          fontSize: 16,
          fontWeight: 600,
          background: loading ? "#9ca3af" : "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
          color: "white",
          border: "none",
          borderRadius: 12,
          cursor: loading || products.length === 0 ? "not-allowed" : "pointer",
          marginBottom: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: loading ? "none" : "0 4px 12px rgba(66, 133, 244, 0.4)"
        }}
        onMouseOver={(e) => {
          if (!loading && products.length > 0) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(66, 133, 244, 0.5)";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(66, 133, 244, 0.4)";
        }}
      >
        <BarChart3 size={20} />
        {loading ? "Analyzing Your Inventory..." : "Generate AI Insights with Gemini"}
      </button>

      {error && (
        <div style={{
          padding: 20,
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: 12,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "1px solid #fecaca"
        }}>
          <AlertTriangle size={20} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{error}</div>
            <div style={{ fontSize: 13 }}>
              Make sure you have GEMINI_API_KEY in your .env file
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{
          padding: 40,
          background: "#f9fafb",
          borderRadius: 12,
          textAlign: "center",
          border: "1px solid #e5e7eb"
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #4285f4",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#6b7280", margin: 0, fontWeight: 500 }}>
            Gemini AI is analyzing your inventory data...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {insights && !loading && (
        <div style={{
          padding: 35,
          background: "linear-gradient(135deg, #4285f415 0%, #34a85315 100%)",
          borderRadius: 12,
          border: "2px solid #dbeafe"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12,
            marginBottom: 25,
            paddingBottom: 20,
            borderBottom: "1px solid #bfdbfe"
          }}>
            <div style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2937" }}>
              Gemini AI Analysis & Recommendations
            </h2>
          </div>
          <div style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.9,
            color: "#374151",
            fontSize: 15
          }}>
            {insights}
          </div>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div style={{
          padding: 60,
          textAlign: "center",
          background: "#f9fafb",
          borderRadius: 12,
          border: "2px dashed #d1d5db"
        }}>
          <Package size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
          <h3 style={{ color: "#374151", marginBottom: 8 }}>No Products Found</h3>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Add some products to your inventory to get AI-powered insights and recommendations
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string;
}) {
  return (
    <div style={{
      padding: 24,
      background: "white",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s, box-shadow 0.2s"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12,
        marginBottom: 12
      }}>
        <div style={{ 
          padding: 10,
          background: `${color}15`,
          borderRadius: 8,
          color: color
        }}>
          {icon}
        </div>
      </div>
      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1f2937" }}>
        {value}
      </div>
    </div>
  );
}