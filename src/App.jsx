import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Menu, Search, Home, Settings } from 'lucide-react';
import ClientList from './components/ClientList';
import ClientFormExpanded from './components/ClientFormExpanded';
import ClientView from './components/ClientView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAddClient = () => {
    setSelectedClient(null);
    setCurrentView('form');
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setCurrentView('form');
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setCurrentView('view');
  };

  const handleSaveClient = (savedClient) => {
    setCurrentView('list');
    setSelectedClient(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedClient(null);
  };

  const handleRemoteAccess = (type, client) => {
    const id = type === 'teamviewer' ? client.teamviewer_id : client.anydesk_id;
    
    if (type === 'teamviewer') {
      // Para TeamViewer, tentamos abrir o protocolo teamviewer:// se disponível
      window.open(`teamviewer10://control?device=${id}`, '_blank');
      // Fallback para a versão web
      setTimeout(() => {
        window.open(`https://start.teamviewer.com/`, '_blank');
      }, 1000);
    } else if (type === 'anydesk') {
      // Para AnyDesk, tentamos abrir o protocolo anydesk:// se disponível
      window.open(`anydesk:${id}`, '_blank');
      // Fallback para mostrar o ID para o usuário
      setTimeout(() => {
        alert(`ID AnyDesk: ${id}\nAbra o AnyDesk e conecte-se usando este ID.`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Agenda Digital</h1>
                <p className="text-xs text-gray-500">Gestão de Clientes</p>
              </div>
            </div>
            
            {/* Menu Mobile */}
            <Button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Menu Mobile Expandido */}
          {showMobileMenu && (
            <div className="mt-4 pb-2 border-t border-gray-100 pt-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => {
                    setCurrentView('list');
                    setShowMobileMenu(false);
                  }}
                  variant={currentView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Clientes</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <Home className="h-4 w-4" />
                  <span className="text-xs">Início</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Config</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        {currentView === 'list' && (
          <ClientList
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
            onViewClient={handleViewClient}
            onRemoteAccess={handleRemoteAccess}
          />
        )}
        
        {currentView === 'form' && (
          <ClientFormExpanded
            client={selectedClient}
            onSave={handleSaveClient}
            onCancel={handleCancel}
          />
        )}
        
        {currentView === 'view' && selectedClient && (
          <ClientView
            client={selectedClient}
            onEdit={handleEditClient}
            onBack={handleCancel}
            onRemoteAccess={handleRemoteAccess}
          />
        )}
      </main>

      {/* Bottom Navigation - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="grid grid-cols-3 gap-1 p-2">
          <Button
            onClick={() => setCurrentView('list')}
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="flex flex-col gap-1 h-auto py-3 rounded-xl"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Clientes</span>
          </Button>
          <Button
            onClick={handleAddClient}
            className="flex flex-col gap-1 h-auto py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Novo</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="flex flex-col gap-1 h-auto py-3 rounded-xl"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Config</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;

