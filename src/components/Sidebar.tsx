import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, BarChart3, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
    },
    {
      name: 'Logs',
      href: '/logs',
      icon: MessageSquare,
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-whatsapp text-white p-2 rounded-lg shadow-md"
        >
          {isCollapsed ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-whatsapp-container border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out h-screen lg:h-full
        ${isCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-whatsapp rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-whatsapp-text">WhatsApp Manager</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-whatsapp text-white shadow-md'
                      : 'text-whatsapp-secondary hover:bg-gray-50 hover:text-whatsapp-text'
                  }`
                }
                onClick={() => setIsCollapsed(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-3">
            {user && (
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-whatsapp text-white text-sm">
                    {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-whatsapp-text truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-whatsapp-secondary truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-whatsapp-secondary hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Cerrar sesión
            </Button>
            
            <div className="text-xs text-whatsapp-secondary text-center">
              WhatsApp Business Platform v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
