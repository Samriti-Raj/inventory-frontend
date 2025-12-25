"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, X, Bell, Package, TrendingDown } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


type AlertType = "critical" | "warning";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: Date;
  productId: string;
  acknowledged: boolean;
}

type FilterType = "all" | "critical" | "warning";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`);
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/alerts/${alertId}/acknowledge`, {
        method: "PUT"
      });
      
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    return alert.type === filter;
  });

  const criticalCount = alerts.filter(a => a.type === "critical").length;
  const warningCount = alerts.filter(a => a.type === "warning").length;

  return (
    <div style={{ 
      padding: "40px 20px", 
      maxWidth: 1400, 
      margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Bell size={32} color="#ef4444" />
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            Alerts & Notifications
          </h1>
        </div>
        <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
          Monitor critical stock levels and receive actionable alerts
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        marginBottom: 30
      }}>
        <StatCard
          icon={<AlertTriangle size={24} />}
          label="Critical Alerts"
          value={criticalCount.toString()}
          color="#ef4444"
        />
        <StatCard
          icon={<Bell size={24} />}
          label="Warning Alerts"
          value={warningCount.toString()}
          color="#f59e0b"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          label="Total Alerts"
          value={alerts.length.toString()}
          color="#3b82f6"
        />
      </div>

      <div style={{ 
        display: "flex", 
        gap: 10, 
        marginBottom: 25,
        flexWrap: "wrap"
      }}>
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All Alerts"
          count={alerts.length}
        />
        <FilterButton
          active={filter === "critical"}
          onClick={() => setFilter("critical")}
          label="Critical"
          count={criticalCount}
          color="#ef4444"
        />
        <FilterButton
          active={filter === "warning"}
          onClick={() => setFilter("warning")}
          label="Warnings"
          count={warningCount}
          color="#f59e0b"
        />
      </div>

      {loading && (
        <div style={{ 
          padding: 40, 
          textAlign: "center",
          background: "#f9fafb",
          borderRadius: 12,
          border: "1px solid #e5e7eb"
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#6b7280", margin: 0 }}>Loading alerts...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div style={{
          padding: 60,
          textAlign: "center",
          background: "#f0fdf4",
          borderRadius: 12,
          border: "2px dashed #86efac"
        }}>
          <CheckCircle size={48} color="#22c55e" style={{ marginBottom: 16 }} />
          <h3 style={{ color: "#166534", marginBottom: 8, fontSize: 20 }}>
            All Clear! 🎉
          </h3>
          <p style={{ color: "#16a34a", margin: 0 }}>
            No alerts at the moment. Your inventory is in good shape!
          </p>
        </div>
      )}

      {!loading && filteredAlerts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
            />
          ))}
        </div>
      )}

      {!loading && alerts.length > 0 && filteredAlerts.length === 0 && (
        <div style={{
          padding: 40,
          textAlign: "center",
          background: "#f9fafb",
          borderRadius: 12,
          border: "1px solid #e5e7eb"
        }}>
          <Bell size={40} color="#9ca3af" style={{ marginBottom: 12 }} />
          <p style={{ color: "#6b7280", margin: 0 }}>
            No {filter} alerts found
          </p>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div style={{
      padding: 24,
      background: "white",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
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

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string;
}

function FilterButton({ active, onClick, label, count, color = "#3b82f6" }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: active ? color : "white",
        color: active ? "white" : "#374151",
        border: active ? "none" : "1px solid #d1d5db",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.2s"
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#f3f4f6";
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.background = "white";
        }
      }}
    >
      {label}
      <span style={{
        background: active ? "rgba(255,255,255,0.2)" : "#e5e7eb",
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 700
      }}>
        {count}
      </span>
    </button>
  );
}

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (alertId: string) => void;
}

function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const getAlertIcon = () => {
    if (alert.title.includes("Out of Stock")) {
      return <Package size={24} />;
    } else if (alert.title.includes("Low Stock")) {
      return <AlertTriangle size={24} />;
    } else if (alert.title.includes("Dead Stock")) {
      return <TrendingDown size={24} />;
    }
    return <Bell size={24} />;
  };

  const getAlertColor = () => {
    return alert.type === "critical" ? "#ef4444" : "#f59e0b";
  };

  const getBgColor = () => {
    return alert.type === "critical" ? "#fef2f2" : "#fffbeb";
  };

  const getBorderColor = () => {
    return alert.type === "critical" ? "#fecaca" : "#fde68a";
  };

  return (
    <div style={{
      padding: 20,
      background: getBgColor(),
      border: `2px solid ${getBorderColor()}`,
      borderRadius: 12,
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      transition: "transform 0.2s, box-shadow 0.2s"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}>
      <div style={{
        padding: 12,
        background: "white",
        borderRadius: 10,
        color: getAlertColor(),
        flexShrink: 0
      }}>
        {getAlertIcon()}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 10,
          marginBottom: 8
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: 16, 
            fontWeight: 700,
            color: "#1f2937"
          }}>
            {alert.title}
          </h3>
          <span style={{
            padding: "2px 10px",
            background: getAlertColor(),
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 12,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            {alert.type}
          </span>
        </div>
        <p style={{ 
          margin: 0, 
          color: "#374151",
          fontSize: 14,
          lineHeight: 1.6
        }}>
          {alert.message}
        </p>
        <div style={{ 
          marginTop: 8,
          fontSize: 12,
          color: "#6b7280"
        }}>
          {new Date(alert.timestamp).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <button
        onClick={() => onAcknowledge(alert.id)}
        style={{
          padding: 8,
          background: "white",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          cursor: "pointer",
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          flexShrink: 0
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f3f4f6";
          e.currentTarget.style.color = "#1f2937";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = "#6b7280";
        }}
        title="Acknowledge and dismiss"
      >
        <X size={20} />
      </button>
    </div>
  );
}