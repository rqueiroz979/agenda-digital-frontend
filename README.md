# Agenda Digital - Frontend

Frontend da aplicação Agenda Digital para cadastro e consulta de clientes, desenvolvido com React e Vite.

## Tecnologias Utilizadas

- React
- Vite
- TailwindCSS
- PWA (Progressive Web App)

## Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd agenda-digital-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto com a seguinte variável:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```
    - `VITE_API_URL`: URL base da API do backend. Para desenvolvimento local, use `http://localhost:5000/api`.

## Execução da Aplicação

Para iniciar o servidor de desenvolvimento do frontend:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

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
