import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Monitor, Eye, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const ClientList = ({ onAddClient, onEditClient, onViewClient, onRemoteAccess }) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchClients();
      return;
    }

    try {
      const response = await fetch(`/api/clients/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Tem certeza que deseja deletar este cliente?')) {
      return;
    }

    try {
      await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
      fetchClients();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const handleWhatsApp = (phone) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${cleanPhone}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com busca */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Meus Clientes</h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
          </Badge>
        </div>
        
        {/* Barra de busca mobile-friendly */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-4 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500"
          />
          {searchTerm && (
            <Button
              onClick={handleSearch}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg"
            >
              Buscar
            </Button>
          )}
        </div>
      </div>

      {/* Lista de clientes */}
      {clients.length === 0 ? (
        <Card className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-300">
          <CardContent className="space-y-4">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-500 mb-4">Comece adicionando seu primeiro cliente</p>
              <Button 
                onClick={onAddClient} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <Card key={client.id} className="rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{client.name}</h3>
                    {client.company && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                        {client.company}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => onViewClient(client)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      onClick={() => onEditClient(client)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-green-50"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(client.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                
                {/* Informações de contato */}
                <div className="space-y-2 mb-4">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{client.phone}</span>
                      <Button
                        onClick={() => handleWhatsApp(client.phone)}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-green-50 ml-auto"
                      >
                        <MessageCircle className="h-3 w-3 text-green-600" />
                      </Button>
                    </div>
                  )}
                  {(client.city || client.state) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{client.city}{client.city && client.state && ', '}{client.state}</span>
                    </div>
                  )}
                </div>
                
                {/* Botões de acesso remoto */}
                {(client.teamviewer_id || client.anydesk_id) && (
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {client.teamviewer_id && (
                      <Button
                        onClick={() => onRemoteAccess('teamviewer', client)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        TeamViewer
                      </Button>
                    )}
                    {client.anydesk_id && (
                      <Button
                        onClick={() => onRemoteAccess('anydesk', client)}
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        AnyDesk
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;

