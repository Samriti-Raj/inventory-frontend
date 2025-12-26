"use client";

import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, AlertTriangle, Package, DollarSign, BarChart3 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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
      console.log("📥 Fetching inventory data...");
      const [productsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/products/stats`)
      ]);
      
      if (!productsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data from backend");
      }
      
      const productsData = await productsRes.json();
      const statsData = await statsRes.json();
      
      console.log(`✅ Loaded ${productsData.length} products`);
      setProducts(productsData);
      setStats(statsData);
    } catch (err: any) {
      console.error("❌ Failed to fetch data:", err);
      setError("Failed to load inventory data. Make sure backend is running.");
    }
  };

  const generateInsights = async () => {
    console.log("\n🤖 ===== GENERATING AI INSIGHTS =====");
    console.log(`📦 Products available: ${products.length}`);
    
    if (products.length === 0) {
      setError("No products available to analyze");
      console.log("❌ No products to analyze");
      return;
    }

    setLoading(true);
    setError("");
    setInsights("");

    try {
      const endpoint = `${API_BASE_URL}/api/ai/insights`;
      console.log(`📤 Sending POST request to: ${endpoint}`);
      console.log(`📦 Payload: ${products.length} products`);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ products })
      });

      console.log(`📡 Response received - Status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.error("❌ Error response body:", errorData);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error("❌ Error response text:", errorText);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Success! Insights received");
      console.log(`📝 Insights length: ${data.insights?.length || 0} characters`);
      
      if (!data.insights) {
        throw new Error("No insights returned from API");
      }
      
      setInsights(data.insights);
      console.log("===== INSIGHTS GENERATION COMPLETE =====\n");
      
    } catch (err: any) {
      console.error("❌ Error in generateInsights:", err);
      console.error("Error type:", err.name);
      console.error("Error message:", err.message);
      
      setError(err.message || "An unexpected error occurred while generating insights");
      console.log("===== INSIGHTS GENERATION FAILED =====\n");
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
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Sparkles size={32} color="#f55036" />
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            AI Inventory Intelligence
          </h1>
        </div>
        <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
          Get data-driven recommendations powered by Groq AI (Llama 3.3 70B)
        </p>
      </div>

      {/* Stats Cards */}
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

      {/* Generate Button */}
      <button
        onClick={generateInsights}
        disabled={loading || products.length === 0}
        style={{
          width: "100%",
          padding: "18px 30px",
          fontSize: 16,
          fontWeight: 600,
          background: loading ? "#9ca3af" : "linear-gradient(135deg, #f55036 0%, #ff8a5c 100%)",
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
          boxShadow: loading ? "none" : "0 4px 12px rgba(245, 80, 54, 0.4)"
        }}
        onMouseOver={(e) => {
          if (!loading && products.length > 0) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 80, 54, 0.5)";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 80, 54, 0.4)";
        }}
      >
        <BarChart3 size={20} />
        {loading ? "Analyzing Your Inventory with Groq AI..." : "Generate AI Insights with Groq"}
      </button>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: 20,
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: 12,
          marginBottom: 20,
          display: "flex",
          alignItems: "start",
          gap: 10,
          border: "1px solid #fecaca"
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Error</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {error}
            </div>
            <div style={{ fontSize: 13, marginTop: 12, opacity: 0.8, background: "#fef2f2", padding: 10, borderRadius: 6 }}>
              <strong>Troubleshooting:</strong>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                <li>Check if backend is running on {API_BASE_URL}</li>
                <li>Verify GROQ_API_KEY is in your .env file</li>
                <li>Test Groq connection: <a href={`${API_BASE_URL}/api/test-groq`} target="_blank" style={{ color: "#991b1b", textDecoration: "underline" }}>Click here</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
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
            borderTop: "4px solid #f55036",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#6b7280", margin: 0, fontWeight: 500 }}>
            🤖 Groq AI (Llama 3.3 70B) is analyzing your inventory data...
          </p>
          <p style={{ color: "#9ca3af", margin: "8px 0 0 0", fontSize: 14 }}>
            This usually takes 5-10 seconds
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Insights Display */}
      {insights && !loading && (
        <div style={{
          padding: 35,
          background: "linear-gradient(135deg, #f5503615 0%, #ff8a5c15 100%)",
          borderRadius: 12,
          border: "2px solid #fecaca"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12,
            marginBottom: 25,
            paddingBottom: 20,
            borderBottom: "1px solid #fecaca"
          }}>
            <div style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #f55036 0%, #ff8a5c 100%)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2937" }}>
                AI Analysis & Recommendations
              </h2>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#6b7280" }}>
                Powered by Groq Llama 3.3 70B Versatile
              </p>
            </div>
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

      {/* Empty State */}
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
