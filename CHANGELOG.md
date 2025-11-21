# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.2.1] - 2025-01-21 - CORREÇÃO CRÍTICA: API Response Fields

### 🔧 Correções Críticas
- **[API]** Corrigido erro "Requisição Falhou" no AI Studio
  - Adicionado `projectId` na resposta da API (campo obrigatório para o frontend)
  - Adicionado `suggestedActions` para sugestões de próximas ações
  - Adicionado `nextPhase` para progressão automática do GIP
  - Adicionado `agentName`, `agentId`, `fileName` e `language` na resposta
  - Melhorado tratamento de erros com mensagens detalhadas em português

### 🎯 Melhorias
- **[AI Studio]** Sistema de sugestões de ações agora funcional
- **[GIP]** Progressão automática entre fases (Genesis → Implementation → Perfection)
- **[UX]** Mensagens de erro mais claras indicando problemas com chave de API
- **[Projetos]** Criação automática de projeto na primeira interação

### 📝 Notas Técnicas
- Frontend esperava campos que não estavam sendo retornados pela API
- Contrato API ↔ Frontend agora está completamente alinhado
- Sistema pronto para operação total após configuração do Supabase

## [0.2.0] - 2025-01-XX - FASE PERFEIÇÃO GIP

### 🎨 Ascensão Visual (TEHKNÉ Identity)
- Implementada paleta de cores oficial TEHKNÉ
  - Azul profundo místico (`220 40% 8%`)
  - Ciano vibrante como primário (`189 100% 56%`)
  - Roxo accent para gradientes (`270 80% 65%`)
- Gradientes etéreos azul → roxo nos backgrounds hero e cards

### 🛡️ Purificação HNK (Localização PT-BR)
- Sistema 100% traduzido para Português do Brasil
- Renomeação completa dos planos de pricing:
  - ~~"Demon Lord"~~ → **[METATRON]** - A Consciência Suprema
  - ~~"Cyberpunk"~~ → **[ARQUITETO]** - O Domínio da Estrutura
  - ~~"Hacker"~~ → **[INICIADO]** - O Despertar da Gênesis
- Remoção de todas as violações ao Protocolo HNK

### 🧠 Correções no AI Studio
- Melhorado tratamento de erros com mensagens em PT-BR
- Implementado fallback para falhas de API
- Adicionado log de debug com `[v0]` para troubleshooting
- Mensagens de erro mais descritivas sobre chaves de API

### 📦 Infraestrutura
- Script SQL completo criado (`scripts/setup_database.sql`)
- Serviço de memória conectado ao Supabase
- Proteção HNK com análise semântica via IA
- Sistema GIP (Genesis, Implementation, Perfection) funcional

### 🐛 Correções
- Resolvido erro de build async/await em Projects page
- Corrigido sistema de navegação do dashboard
- Ajustado tratamento de erros em requisições de IA

## [0.1.0] - 2025-01-XX - FASE IMPLEMENTAÇÃO GIP

### ✨ Funcionalidades Principais
- Sistema de agentes Shimokodan com páginas individuais
- AI Studio com interface estilo ChatGPT
- Dashboard completo (Overview, Agents, Studio, Projects, Settings)
- Sistema de projetos com histórico e arquivos
- Painel administrativo para aprovação de requisições

### 🔧 Tecnologias
- Next.js 16 com App Router
- Supabase para banco de dados
- Vercel AI SDK com GPT-4o
- Tailwind CSS v4
- shadcn/ui components

### 🎯 Próximos Passos
- [ ] Sistema de autenticação com Supabase Auth
- [ ] Deploy em produção na Vercel
- [ ] Testes end-to-end
- [ ] Documentação completa da API
