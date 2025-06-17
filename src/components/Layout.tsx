
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-whatsapp-bg font-inter">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 lg:ml-0">
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
