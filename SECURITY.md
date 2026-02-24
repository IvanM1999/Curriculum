# Medidas de Segurança e Privacidade

## 🔒 Proteção de Dados

Este portfólio implementa várias medidas de segurança para proteger seus dados:

### 1. **Content Security Policy (CSP)**
- Restringe o carregamento de scripts a origens confiáveis
- Previne ataques XSS (Cross-Site Scripting)
- Apenas scripts do CDN autorizado são executados

### 2. **Headers de Segurança**
- **X-Content-Type-Options**: Previne sniffing de tipo de conteúdo
- **X-Frame-Options**: Protege contra clickjacking
- **X-XSS-Protection**: Ativa proteção contra XSS
- **Referrer-Policy**: Controla informações de referência

### 3. **Proteção de Informações Sensíveis**
- Links de telefone usam protocolo `tel://`
- Emails são diretos para evitar obfuscação desnecessária
- Detecção de tentativas de cópia de informações sensíveis

### 4. **Schema.org Markup**
- Fornece contexto estruturado para mecanismos de busca
- Facilita validação de dados
- Melhora visibilidade em resultados de busca

## 📊 SEO Otimizado

### Meta Tags Implementadas
- ✅ Description (158 caracteres)
- ✅ Keywords (8 palavras-chave)
- ✅ Author
- ✅ Robots (index, follow)
- ✅ Viewport para mobile
- ✅ Charset UTF-8

### Open Graph
- Otimizado para compartilhamento em redes sociais
- Imagem de preview definida
- Tipo de conteúdo: profile

### Twitter Card
- Card type: summary
- Compatível com X (Twitter)

### Structured Data
- Schema.org Person
- Incluí jobTitle, URL, sameAs (redes sociais)
- Informações de educação (UNIASSELVI)

## 🤖 Proteção Anti-Bot

### Medidas Implementadas
- Detecção de DevTools abertos
- Logs de segurança no console
- Prevenção de scraping de informações sensíveis
- Atributo `data-protected` no HTML

### robots.txt
- Permite acesso a buscadores legítimos
- Bloqueia bots maliciosos conhecidos (MJ12bot)
- Sitemap configurado para Google

## 📝 Acessibilidade

### WCAG 2.1 Compliance
- Links com `rel="noopener noreferrer"` para abrir em nova aba
- `title` attributes em todos os links interativos
- `aria-label` para elementos que precisam
- Contraste de cores adequado
- Foco visual para navegação por teclado

## 🔗 GDPR / Conformidade Legal

- Sem cookies rastreadores
- Sem coleta desnecessária de dados
- Dados sensíveis protegidos
- Política de Privacidade disponível

## 📱 Responsive Design

- Mobile-first approach
- Flexbox e Grid para layout robusto
- Tested em:
  - Desktop (1920px+)
  - Tablet (768px - 1024px)
  - Mobile (320px - 480px)

## 🔧 Manutenção de Segurança

### Atualizações Recomendadas
- [ ] Monitorar CVE para dependências do CDN
- [ ] Testar periodicamente com ferramentas de segurança
- [ ] Validar links externos regularmente
- [ ] Atualizar sitemap.xml mensalmente

### Ferramentas de Teste Sugeridas
- Google Lighthouse
- Google Search Console
- Mozilla Observatory
- WebAIM WAVE

## 📞 Contato de Segurança

Se encontrar uma vulnerabilidade, entre em contato:
- Email: ivan.m301299@outlook.com
- WhatsApp: https://wa.me/5547984863051

---

**Última atualização:** 24/02/2026
**Versão:** 1.0
