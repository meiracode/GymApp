import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-body">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-content">
        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {children}
      </main>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}
    </div>
  );
}

export default Layout;
