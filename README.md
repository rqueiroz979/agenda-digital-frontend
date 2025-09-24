# Agenda Digital - Frontend

Frontend da aplicação Agenda Digital para cadastro e consulta de clientes, desenvolvido com React e Vite.

## Tecnologias Utilizadas

- React
- Vite
- TailwindCSS
- PWA (Progressive Web App)

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build
```

## Funcionalidades

- Cadastro completo de clientes
- Consulta automática de CNPJ e CEP
- Integração com WhatsApp
- Interface mobile-first
- Funcionamento offline (PWA)

## Estrutura do Projeto

```
agenda-digital-frontend/
├── public/
│   ├── manifest.json            # Configuração do PWA
│   ├── service-worker.js        # Service Worker para PWA
│   └── icons/                   # Ícones do PWA
├── src/
│   ├── components/
│   │   ├── ui/                  # Componentes de UI reutilizáveis
│   │   ├── ClientList.jsx       # Componente de listagem de clientes
│   │   ├── ClientFormExpanded.jsx # Formulário de cliente
│   │   └── ClientView.jsx       # Visualização detalhada do cliente
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos do componente principal
│   ├── main.jsx                 # Ponto de entrada da aplicação
│   └── index.css                # Estilos globais
├── index.html                   # HTML principal com configurações PWA
├── vite.config.js               # Configuração do Vite
├── package.json                 # Dependências do frontend
└── netlify.toml                 # Configuração para deploy no Netlify
```

## Deploy

Este projeto está configurado para deploy automático no Netlify.
