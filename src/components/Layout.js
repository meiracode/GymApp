import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="layout-body">
      <Sidebar />

      <main className="page-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
