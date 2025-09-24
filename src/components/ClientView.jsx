import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Monitor, MessageCircle, Building, User, FileText } from 'lucide-react';

const ClientView = ({ client, onEdit, onBack, onRemoteAccess }) => {
  const handleWhatsApp = (phone) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${cleanPhone}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => onEdit(client)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Informações Básicas */}
      <Card className="rounded-2xl border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">{client.name}</CardTitle>
              {client.company && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {client.company}
                </Badge>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.fantasy_name && (
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Nome Fantasia:</span>
              <span className="font-medium">{client.fantasy_name}</span>
            </div>
          )}
          {client.cnpj_cpf && (
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">CPF/CNPJ:</span>
              <span className="font-medium">{client.cnpj_cpf}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contato */}
      <Card className="rounded-2xl border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-600" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.email && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{client.email}</span>
              </div>
              <Button
                onClick={() => window.open(`mailto:${client.email}`)}
                variant="outline"
                size="sm"
                className="rounded-lg"
              >
                Email
              </Button>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{client.phone}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`tel:${client.phone}`)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  Ligar
                </Button>
                <Button
                  onClick={() => handleWhatsApp(client.phone)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {client.phone2 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{client.phone2}</span>
                <Badge variant="secondary" className="text-xs">Tel. 2</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`tel:${client.phone2}`)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  Ligar
                </Button>
                <Button
                  onClick={() => handleWhatsApp(client.phone2)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {client.mobile && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{client.mobile}</span>
                <Badge variant="secondary" className="text-xs">Celular</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`tel:${client.mobile}`)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  Ligar
                </Button>
                <Button
                  onClick={() => handleWhatsApp(client.mobile)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Endereço */}
      {(client.address || client.city || client.state) && (
        <Card className="rounded-2xl border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {client.address && (
                <p className="text-gray-900">
                  {client.address}
                  {client.number && `, ${client.number}`}
                  {client.complement && ` - ${client.complement}`}
                </p>
              )}
              {client.neighborhood && (
                <p className="text-gray-600">{client.neighborhood}</p>
              )}
              {(client.city || client.state) && (
                <p className="text-gray-600">
                  {client.city}{client.city && client.state && ', '}{client.state}
                  {client.cep && ` - ${client.cep}`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acesso Remoto */}
      {(client.teamviewer_id || client.anydesk_id) && (
        <Card className="rounded-2xl border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-purple-600" />
              Acesso Remoto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.teamviewer_id && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-medium text-blue-900">TeamViewer</p>
                  <p className="text-blue-700 text-sm">{client.teamviewer_id}</p>
                </div>
                <Button
                  onClick={() => onRemoteAccess('teamviewer', client)}
                  className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              </div>
            )}
            
            {client.anydesk_id && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div>
                  <p className="font-medium text-purple-900">AnyDesk</p>
                  <p className="text-purple-700 text-sm">{client.anydesk_id}</p>
                </div>
                <Button
                  onClick={() => onRemoteAccess('anydesk', client)}
                  className="bg-purple-600 hover:bg-purple-700 rounded-lg"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações Adicionais */}
      {(client.notes || client.tax_regime || client.monthly_fee) && (
        <Card className="rounded-2xl border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Informações Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.tax_regime && (
              <div>
                <span className="text-gray-600 text-sm">Regime Tributário:</span>
                <p className="font-medium">{client.tax_regime}</p>
              </div>
            )}
            
            {client.monthly_fee && (
              <div>
                <span className="text-gray-600 text-sm">Mensalidade:</span>
                <p className="font-medium text-green-600">R$ {client.monthly_fee}</p>
              </div>
            )}
            
            {client.vendor && (
              <div>
                <span className="text-gray-600 text-sm">Vendedor:</span>
                <p className="font-medium">{client.vendor}</p>
              </div>
            )}
            
            {client.notes && (
              <div>
                <span className="text-gray-600 text-sm">Observações:</span>
                <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientView;

