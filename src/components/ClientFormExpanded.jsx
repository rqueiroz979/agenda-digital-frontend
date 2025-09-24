import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MessageCircle, Save, X, Monitor, User, Building, Phone, Mail, MapPin, FileText, Settings } from 'lucide-react';

const ClientFormExpanded = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    fantasy_name: client?.fantasy_name || '',
    cnpj_cpf: client?.cnpj_cpf || '',
    email: client?.email || '',
    phone: client?.phone || '',
    phone2: client?.phone2 || '',
    mobile: client?.mobile || '',
    cep: client?.cep || '',
    address: client?.address || '',
    number: client?.number || '',
    complement: client?.complement || '',
    neighborhood: client?.neighborhood || '',
    city: client?.city || '',
    state: client?.state || '',
    country: client?.country || 'Brasil',
    company: client?.company || '',
    state_registration: client?.state_registration || '',
    municipal_code: client?.municipal_code || '',
    country_code: client?.country_code || '1058',
    teamviewer_id: client?.teamviewer_id || '',
    anydesk_id: client?.anydesk_id || '',
    notes: client?.notes || '',
    contact_info: client?.contact_info || '',
    client_group: client?.client_group || '',
    vendor: client?.vendor || '',
    contract_type: client?.contract_type || '',
    payment_type: client?.payment_type || '',
    tax_regime: client?.tax_regime || '',
    monthly_fee: client?.monthly_fee || '',
    last_purchase: client?.last_purchase || '',
    sale_value: client?.sale_value || ''
  });

  const [loading, setLoading] = useState({
    cnpj: false,
    cep: false,
    saving: false
  });

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const consultarCNPJ = async () => {
    if (!formData.cnpj_cpf) {
      setErrors(prev => ({ ...prev, cnpj_cpf: 'Digite um CNPJ para consultar' }));
      return;
    }

    setLoading(prev => ({ ...prev, cnpj: true }));
    setErrors(prev => ({ ...prev, cnpj_cpf: '' }));

    try {
      const response = await fetch(`/api/cnpj/${formData.cnpj_cpf}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setFormData(prev => ({
          ...prev,
          name: data.razao_social || prev.name,
          fantasy_name: data.nome_fantasia || prev.fantasy_name,
          phone: data.telefone || prev.phone,
          email: data.email || prev.email,
          cep: data.cep || prev.cep,
          address: data.logradouro || prev.address,
          number: data.numero || prev.number,
          complement: data.complemento || prev.complement,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.municipio || prev.city,
          state: data.uf || prev.state
        }));
        
        // Se preencheu CEP, consultar automaticamente
        if (data.cep && data.cep !== prev.cep) {
          setTimeout(() => consultarCEP(data.cep), 500);
        }
      } else {
        setErrors(prev => ({ ...prev, cnpj_cpf: result.error }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, cnpj_cpf: 'Erro ao consultar CNPJ. Tente novamente.' }));
    } finally {
      setLoading(prev => ({ ...prev, cnpj: false }));
    }
  };

  const consultarCEP = async (cepValue = null) => {
    const cep = cepValue || formData.cep;
    if (!cep) {
      setErrors(prev => ({ ...prev, cep: 'Digite um CEP para consultar' }));
      return;
    }

    setLoading(prev => ({ ...prev, cep: true }));
    setErrors(prev => ({ ...prev, cep: '' }));

    try {
      const response = await fetch(`/api/cep/${cep}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || prev.address,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state
        }));
      } else {
        setErrors(prev => ({ ...prev, cep: result.error }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, cep: 'Erro ao consultar CEP. Tente novamente.' }));
    } finally {
      setLoading(prev => ({ ...prev, cep: false }));
    }
  };

  const handleWhatsApp = (phone) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${cleanPhone}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(prev => ({ ...prev, saving: true }));

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
        setErrors({ submit: error.error || 'Erro ao salvar cliente' });
      }
    } catch (error) {
      setErrors({ submit: 'Erro ao salvar cliente. Tente novamente.' });
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const sections = [
    { id: 'basic', label: 'Básico', icon: User },
    { id: 'contact', label: 'Contato', icon: Phone },
    { id: 'address', label: 'Endereço', icon: MapPin },
    { id: 'remote', label: 'Acesso', icon: Monitor },
    { id: 'additional', label: 'Extras', icon: Settings }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <p className="text-gray-500">Preencha as informações do cliente</p>
        </div>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              variant={activeSection === section.id ? 'default' : 'ghost'}
              size="sm"
              className={`flex-shrink-0 rounded-lg ${
                activeSection === section.id 
                  ? 'bg-white shadow-sm' 
                  : 'hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {section.label}
            </Button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção Básica */}
        {activeSection === 'basic' && (
          <Card className="rounded-2xl border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome/Razão Social *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-xl border-2 focus:border-blue-500"
                  placeholder="Digite o nome ou razão social"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fantasy_name" className="text-sm font-medium">
                  Nome Fantasia
                </Label>
                <Input
                  id="fantasy_name"
                  name="fantasy_name"
                  value={formData.fantasy_name}
                  onChange={handleInputChange}
                  className="rounded-xl border-2 focus:border-blue-500"
                  placeholder="Nome fantasia da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj_cpf" className="text-sm font-medium">
                  CPF/CNPJ
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="cnpj_cpf"
                    name="cnpj_cpf"
                    value={formData.cnpj_cpf}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="00.000.000/0000-00"
                  />
                  <Button
                    type="button"
                    onClick={consultarCNPJ}
                    disabled={loading.cnpj}
                    variant="outline"
                    className="rounded-xl px-4"
                  >
                    {loading.cnpj ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.cnpj_cpf && <p className="text-red-500 text-sm">{errors.cnpj_cpf}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Empresa/Categoria
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="rounded-xl border-2 focus:border-blue-500"
                  placeholder="Categoria ou tipo de empresa"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seção Contato */}
        {activeSection === 'contact' && (
          <Card className="rounded-2xl border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rounded-xl border-2 focus:border-blue-500"
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telefone Principal *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                  <Button
                    type="button"
                    onClick={() => handleWhatsApp(formData.phone)}
                    variant="outline"
                    size="icon"
                    className="rounded-xl text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone2" className="text-sm font-medium">
                  Telefone 2
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phone2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                  <Button
                    type="button"
                    onClick={() => handleWhatsApp(formData.phone2)}
                    variant="outline"
                    size="icon"
                    className="rounded-xl text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium">
                  Celular
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                  <Button
                    type="button"
                    onClick={() => handleWhatsApp(formData.mobile)}
                    variant="outline"
                    size="icon"
                    className="rounded-xl text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seção Endereço */}
        {activeSection === 'address' && (
          <Card className="rounded-2xl border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cep" className="text-sm font-medium">
                  CEP
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="00000-000"
                  />
                  <Button
                    type="button"
                    onClick={() => consultarCEP()}
                    disabled={loading.cep}
                    variant="outline"
                    className="rounded-xl px-4"
                  >
                    {loading.cep ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.cep && <p className="text-red-500 text-sm">{errors.cep}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Logradouro
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-sm font-medium">
                    Número
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement" className="text-sm font-medium">
                  Complemento
                </Label>
                <Input
                  id="complement"
                  name="complement"
                  value={formData.complement}
                  onChange={handleInputChange}
                  className="rounded-xl border-2 focus:border-blue-500"
                  placeholder="Apto, Sala, Bloco..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-sm font-medium">
                    Bairro
                  </Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="Nome do bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="Nome da cidade"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    Estado (UF)
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    País
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="Brasil"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seção Acesso Remoto */}
        {activeSection === 'remote' && (
          <Card className="rounded-2xl border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                Acesso Remoto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamviewer_id" className="text-sm font-medium">
                  ID TeamViewer
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="teamviewer_id"
                    name="teamviewer_id"
                    value={formData.teamviewer_id}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="123 456 789"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl px-4 text-blue-600 hover:bg-blue-50"
                    disabled={!formData.teamviewer_id}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anydesk_id" className="text-sm font-medium">
                  ID AnyDesk
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="anydesk_id"
                    name="anydesk_id"
                    value={formData.anydesk_id}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="123456789"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl px-4 text-purple-600 hover:bg-purple-50"
                    disabled={!formData.anydesk_id}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seção Informações Adicionais */}
        {activeSection === 'additional' && (
          <Card className="rounded-2xl border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state_registration" className="text-sm font-medium">
                  Inscrição Estadual/RG
                </Label>
                <Input
                  id="state_registration"
                  name="state_registration"
                  value={formData.state_registration}
                  onChange={handleInputChange}
                  className="rounded-xl border-2 focus:border-blue-500"
                  placeholder="Número da inscrição"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_regime" className="text-sm font-medium">
                  Regime Tributário
                </Label>
                <select
                  id="tax_regime"
                  name="tax_regime"
                  value={formData.tax_regime}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 px-3 py-2"
                >
                  <option value="">Selecione...</option>
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
                  <option value="MEI">MEI</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="monthly_fee" className="text-sm font-medium">
                    Mensalidade (R$)
                  </Label>
                  <Input
                    id="monthly_fee"
                    name="monthly_fee"
                    value={formData.monthly_fee}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor" className="text-sm font-medium">
                    Vendedor
                  </Label>
                  <Input
                    id="vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-blue-500"
                    placeholder="Nome do vendedor"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Observações
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="rounded-xl border-2 focus:border-blue-500 min-h-[100px]"
                  placeholder="Informações adicionais sobre o cliente..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 rounded-xl py-3"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading.saving}
            className="flex-1 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading.saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {client ? 'Atualizar' : 'Salvar'} Cliente
          </Button>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientFormExpanded;

