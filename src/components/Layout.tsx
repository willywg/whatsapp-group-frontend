import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen bg-whatsapp-bg font-inter overflow-hidden">
      <div className="flex h-full">
        <Sidebar />
        
        <div className="flex-1 lg:ml-0 flex flex-col">
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
