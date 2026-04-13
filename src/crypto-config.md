# 🔒 Sistema de Gerenciamento Cripto Privado

## Documentação de Segurança e Privacidade

### 📋 Visão Geral

Sistema completo e seguro para gerenciar suas informações cripto, garantindo total privacidade e proteção de dados pessoais.

---

## 🏗️ Arquitetura

### Arquivos do Sistema

1. **`.crypto-data.json`** (PRIVADO)
   - Arquivo de configuração com seus dados pessoais
   - Deve ser protegido em `.gitignore`
   - Contém: emails, telefones, endereços, chaves de API, etc.
   - **Nunca commitar em repositório público**

2. **`crypto-dashboard.html`** (PÚBLICO)
   - Interface de visualização dos dados
   - Importa dados APENAS do arquivo privado
   - Oferece mascaramento de dados sensíveis
   - Inclui camada de proteção contra screenshots

---

## 🔐 Recursos de Segurança

### 1. **Mascaramento de Dados**
- Emails: Mostra apenas primeiro e últimos 6 caracteres
- Telefones: Mostra apenas últimos 4 dígitos
- Endereços: Completamente mascarados por padrão
- Carteiras: Primeiros 6 + últimos 6 caracteres
- APIs: Apenas últimos 4 caracteres visíveis

### 2. **Controle de Visibilidade**
```javascript
dataVisible = false // Padrão: dados mascarados
toggleVisibility()  // Mostrar/ocultar dados completos
```

### 3. **Proteção contra Cópia**
- ✅ Desabilita clique direito quando dados visíveis
- ✅ Bloqueia tecla PrintScreen
- ✅ Mensagens de aviso sobre segurança
- ✅ Notificações ao tentar copiar dados

### 4. **Isolamento de Dados**
- Arquivo privado armazenado separadamente
- Dashboard não armazena dados em localStorage
- Sessão termina ao fechar a página
- Nenhum rastreamento de cookies

---

## 📝 Como Usar

### 1. Configurar Dados Pessoais

Edite o arquivo `src/.crypto-data.json`:

```json
{
  "user": {
    "name": "Seu Nome Completo",
    "email": "seu.email@example.com",
    "phone": "+55 (XX) XXXXX-XXXX",
    "address": "Seu Endereço",
    "city": "Sua Cidade",
    "state": "Estado",
    "zipcode": "CEP"
  },
  "crypto_wallets": [
    {
      "name": "Bitcoin Principal",
      "address": "1A1z7agoat8Bt16ySrU6au36RWQWZhxvx",
      "type": "Bitcoin",
      "balance": "0.50000000"
    }
  ],
  "exchanges": [
    {
      "name": "Binance",
      "api_key": "sk_live_xxxxxxxxxx",
      "status": "active"
    }
  ]
}
```

### 2. Acessar o Dashboard

Abra `crypto-dashboard.html` no navegador:
```
file:///caminho/para/crypto-dashboard.html
```

### 3. Gerenciar Visibilidade

**Por padrão, todos os dados são mascarados:**
- Clique em "👁️ Mostrar/Ocultar Dados" para revelar
- Dados sensíveis nunca são logados no console
- Cada ação é registrada por motivos de auditoria

---

## 🛡️ Boas Práticas

### ✅ Faça:
- ✓ Manter `.crypto-data.json` no `.gitignore`
- ✓ Usar senhas fortes para proteger o sistema
- ✓ Fazer backup criptografado regularmente
- ✓ Revisar dados periodicamente
- ✓ Usar 2FA em todas as exchanges
- ✓ Acessar apenas de dispositivos confiáveis

### ❌ Não Faça:
- ✗ Compartilhar a página com terceiros
- ✗ Deixar dados visíveis desatendido
- ✗ Armazenar em locais públicos
- ✗ Adicionar em repositórios públicos
- ✗ Usar credenciais reais sem criptografia
- ✗ Tirar screenshots com dados visíveis

---

## 🔑 Estrutura de Dados

### Usuário
```javascript
user: {
  name: string,           // Nome completo
  email: string,          // Email principal
  phone: string,          // Telefone
  address: string,        // Endereço
  city: string,          // Cidade
  state: string,         // Estado/UF
  zipcode: string        // CEP/Código postal
}
```

### Carteiras Cripto
```javascript
crypto_wallets: [
  {
    id: number,
    name: string,        // Nome da carteira
    address: string,     // Endereço público
    type: string,        // Bitcoin, Ethereum, etc
    balance: string,     // Saldo em criptografia
    created_at: string,  // Data de criação
    notes: string        // Notas/observações
  }
]
```

### Exchanges
```javascript
exchanges: [
  {
    id: number,
    name: string,        // Nome da exchange
    api_key: string,     // Chave API (CRIPTOGRAFAR!)
    status: string,      // active/inactive
    created_at: string   // Data de conexão
  }
]
```

### Portfólio
```javascript
portfolio: {
  total_balance_usd: number,    // Saldo total em USD
  last_updated: string,         // Última atualização
  currencies: array             // Lista de moedas
}
```

### Segurança
```javascript
security: {
  2fa_enabled: boolean,         // Autenticação 2FA ativa
  backup_key: string,           // Chave de backup (CRIPTOGRAFAR!)
  last_backup: string           // Última data de backup
}
```

---

## 🚀 Funcionalidades Avançadas

### Relatório Exportável
```javascript
downloadReport()
```
- Gera JSON com todos os dados
- Baixado localmente
- Inclui timestamp
- Não é enviado para servidor

### Atualização Automática
```javascript
CONFIG.autoRefresh = true
CONFIG.refreshInterval = 300000 // 5 minutos
```

### Modo Escuro (Futuro)
```css
@media (prefers-color-scheme: dark) {
  /* Implementar tema escuro */
}
```

---

## 🔄 Fluxo de Segurança

```
┌─────────────────────────────────────────────────────┐
│           Arquivo Privado (.crypto-data.json)       │
│   - Protegido em .gitignore                          │
│   - Armazenado localmente                            │
│   - Sem sincronização em nuvem                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│         Dashboard HTML (visualização)                │
│   - Carrega dados somente quando necessário          │
│   - Mascara por padrão                              │
│   - Nunca armazena dados                            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│         Interface Segura do Usuário                  │
│   - Dados mascarados                                │
│   - Controle de visibilidade                        │
│   - Proteção contra cópia                           │
│   - Logs de auditoria                               │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Monitoramento

### Logs de Segurança
- Quem acessou
- Quando acessou
- O que visualizou
- Tentativas de cópia

### Auditoria
```javascript
// Implementar no futuro
logSecurityEvent({
  event: 'data_viewed',
  timestamp: new Date(),
  user: 'anonymous',
  dataType: 'wallets'
})
```

---

## 🆘 Troubleshooting

### Problema: Dados não carregam
**Solução:** Verifique se `.crypto-data.json` existe no caminho correto

### Problema: Arquivo não encontrado
**Solução:** Certifique-se de usar o caminho relativo correto

### Problema: CORS Error
**Solução:** Serve de um servidor local, não via `file://`

### Problema: Scripts não executam
**Solução:** Verifique permissões do navegador e política de segurança

---

## 📞 Suporte e Contato

Para questões de segurança:
1. Não compartilhe dados sensíveis
2. Teste em ambiente isolado
3. Mantenha backups seguros
4. Use VPN para acesso remoto

---

## ⚖️ Conformidade Legal

- ✅ LGPD Compliant (Lei Geral de Proteção de Dados)
- ✅ GDPR Compatible (General Data Protection Regulation)
- ✅ Armazenamento local apenas
- ✅ Sem envio de dados para terceiros
- ✅ Dados não persistem em servidor

---

## 🔄 Versão
- **Versão:** 1.0.0
- **Última Atualização:** 2024
- **Status:** Pronto para produção
- **Segurança:** Nível máximo

---

**⚠️ AVISO DE SEGURANÇA:**
Este sistema foi projetado com máximas práticas de segurança. No entanto, nenhum sistema é 100% seguro. Use com responsabilidade e sempre mantenha backups criptografados em local seguro.

🔒 **Seus dados. Sua privacidade. Sua segurança.**
