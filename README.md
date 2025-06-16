# Meu Bairro Joinville

![Prévia do Meu Bairro Joinville](https://i.imgur.com/Gd1DfBH.png)
## 📌 Sobre o Projeto

**Meu Bairro Joinville** é uma plataforma de tecnologia cívica projetada para empoderar os cidadãos de Joinville. A aplicação permite que os moradores registrem e visualizem ocorrências em seus bairros, como buracos na via, problemas de iluminação pública e lixo acumulado, criando um canal direto e visual para a comunicação de problemas comunitários.

O projeto foi construído como uma aplicação **full-stack**, com um frontend moderno e interativo, um backend robusto para gerenciar a lógica de negócios e um banco de dados relacional para persistir os dados.

### ✨ Funcionalidades Principais

* **Registro de Ocorrências:** Formulário intuitivo para registrar novos problemas, incluindo tipo, descrição e localização.
* **Geolocalização Automática:** Botão "Usar Minha Localização" que preenche automaticamente as coordenadas (latitude e longitude) e busca o endereço correspondente usando reverse geocoding.
* **Upload de Imagens:** Anexo de fotos como evidência da ocorrência, com armazenamento seguro na nuvem.
* **Mapa Interativo:** Todas as ocorrências são exibidas em um mapa, permitindo uma visualização geográfica clara dos problemas da cidade.
* **Notificações por E-mail:** Envio automático de e-mail (via SendGrid) após o registro de uma nova ocorrência.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias e serviços:

### **Frontend**

| Tecnologia | Descrição |
| :--- | :--- |
| **Next.js** | Framework React para renderização no servidor e geração de sites estáticos. |
| **React** | Biblioteca para construção de interfaces de usuário. |
| **Tailwind CSS** | Framework de CSS utility-first para estilização rápida e moderna. |
| **React Hot Toast** | Biblioteca para notificações e alertas elegantes. |

### **Backend**

| Tecnologia | Descrição |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript no servidor. |
| **Express.js** | Framework minimalista para construção da API REST. |
| **PostgreSQL** | Banco de dados relacional para armazenamento dos dados. |
| **CORS** | Middleware para habilitar o Cross-Origin Resource Sharing. |
| **Multer** | Middleware para manipulação de uploads de arquivos (`multipart/form-data`). |

### **Banco de Dados & Serviços**

| Serviço | Propósito |
| :--- | :--- |
| **Render** | Plataforma de nuvem para a hospedagem do Backend (Web Service) e do Banco de Dados PostgreSQL. |
| **Vercel** | Plataforma de nuvem para o deploy e hospedagem do Frontend, com integração contínua com o GitHub. |
| **Cloudinary** | Serviço de gerenciamento de mídias para o upload e armazenamento das imagens das ocorrências. |
| **SendGrid** | Serviço de e-mail transacional para o envio de notificações. |
| **UptimeRobot** | Serviço de monitoramento para manter o backend no plano gratuito do Render sempre ativo ("warm"). |

## 🌐 Links

* **Site em Produção:** [https://www.meubairrojoinville.com](https://www.meubairrojoinville.com)
* **API em Produção:** [https://meu-bairro-joinville.onrender.com](https://meu-bairro-joinville.onrender.com)

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento.

### **Pré-requisitos**

* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando localmente.
* Um gerenciador de pacotes como `npm` ou `yarn`.

### **1. Configuração do Backend**

```bash
# Clone o repositório
git clone [https://github.com/donyxxj7/meu-bairro-joinville.git](https://github.com/donyxxj7/meu-bairro-joinville.git)

# Navegue até a pasta do backend
cd meu-bairro-joinville/backend

# Instale as dependências
npm install
```

**Banco de Dados Local:**
1.  Crie um banco de dados no seu PostgreSQL local chamado `meu_bairro_joinville`.
2.  Execute o script `schema.sql` (que está na raiz do projeto) para criar as tabelas e popular os bairros.

**Variáveis de Ambiente:**
1.  Crie um arquivo chamado `.env` dentro da pasta `backend`.
2.  Copie e cole o conteúdo abaixo, substituindo os valores pelos seus dados locais e suas chaves de API.

```ini
# backend/.env.example

# --- BANCO DE DADOS POSTGRESQL LOCAL ---
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_do_postgres
DB_PASSWORD=sua_senha_secreta
DB_DATABASE=meu_bairro_joinville

# --- SENDGRID (para envio de emails) ---
SENDER_EMAIL=seu_email_verificado@sendgrid.com
SENDGRID_API_KEY=sua_chave_de_api_do_sendgrid_aqui

# --- CLOUDINARY (para upload de imagens) ---
CLOUDINARY_CLOUD_NAME=seu_cloud_name_do_cloudinary
CLOUDINARY_API_KEY=sua_api_key_do_cloudinary
CLOUDINARY_API_SECRET=seu_api_secret_do_cloudinary
```

**Iniciando o Backend:**
```bash
# A partir da pasta /backend
npm run dev
```
O servidor backend estará rodando em `[Clique Aqui](https://meu-bairro-joinville.onrender.com)`.

### **2. Configuração do Frontend**

```bash
# Em um novo terminal, navegue até a pasta do frontend
cd meu-bairro-joinville/frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
A aplicação frontend estará acessível em `http://localhost:3000`.

## 👨‍💻 Autor

**Donyzete**

* GitHub: [@donyxxj7](https://github.com/donyxxj7)
* LinkedIn: [Meu Linkdin](www.linkedin.com/in/donyzete)

---

Feito com ❤️ e muito café!
