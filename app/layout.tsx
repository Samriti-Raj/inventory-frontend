import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Inventory Management System",
  description: "AI-powered inventory visibility for AEC businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav style={{
          padding: "15px 30px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 15,
          flexWrap: "wrap"
        }}>
          <div style={{
            fontWeight: "bold",
            fontSize: 18,
            color: "white",
            marginRight: 20
          }}>
            Inventory Pro
          </div>

          <a href="/" style={linkStyle}>Dashboard</a>
          <a href="/add" style={linkStyle}>Add Product</a>
          <a href="/search" style={linkStyle}>Search</a>
          <span style={separatorStyle}>|</span>
          <a href="/low-stock" style={linkStyle}>Low Stock</a>
          <a href="/dead-stock" style={linkStyle}>Dead Stock</a>
          <span style={separatorStyle}>|</span>
          <a href="/sales" style={linkStyle}>Sales</a>
          <a href="/alerts" style={linkStyle}>Alerts</a>
          <a href="/insights" style={specialLinkStyle}>AI Insights</a>
        </nav>

        <main style={{
          minHeight: "calc(100vh - 80px)",
          background: "#f9fafb"
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  fontWeight: 500
};

const specialLinkStyle = {
  color: "#fbbf24",
  textDecoration: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  fontWeight: "bold",
  background: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(251, 191, 36, 0.5)"
};

const separatorStyle = {
  color: "rgba(255,255,255,0.5)",
  margin: "0 5px"
};