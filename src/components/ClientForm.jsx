import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';


const ClientForm = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    teamviewer_id: '',
    anydesk_id: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        address: client.address || '',
        notes: client.notes || '',
        teamviewer_id: client.teamviewer_id || '',
        anydesk_id: client.anydesk_id || ''
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    setLoading(true);

    try {
      const url = client ? `/api/clients/${client.id}` : '/api/clients';
      const method = client ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedClient = await response.json();
        onSave(savedClient);
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button onClick={onCancel} variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {client ? 'Editar Cliente' : 'Novo Cliente'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Endereço completo"
                rows={3}
              />
            </div>

            {/* IDs de acesso remoto */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Acesso Remoto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamviewer_id">ID TeamViewer</Label>
                  <Input
                    id="teamviewer_id"
                    name="teamviewer_id"
                    value={formData.teamviewer_id}
                    onChange={handleChange}
                    placeholder="123 456 789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anydesk_id">ID AnyDesk</Label>
                  <Input
                    id="anydesk_id"
                    name="anydesk_id"
                    value={formData.anydesk_id}
                    onChange={handleChange}
                    placeholder="123456789"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Observações adicionais sobre o cliente"
                rows={4}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {client ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button type="button" onClick={onCancel} variant="outline">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;

