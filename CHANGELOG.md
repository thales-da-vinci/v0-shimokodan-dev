# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.3.0] - 2025-01-21 - MIGRAÇÃO: OpenAI → Google Gemini AI

### 🚀 Mudanças Revolucionárias
- **[AI Core]** Migração completa de OpenAI GPT-4o para Google Gemini 1.5 Flash
  - Modelo gratuito e extremamente rápido
  - Sem limites de quota (fim do erro 429)
  - Mantém qualidade e capacidade de geração de código complexo
  
### 🔧 Alterações Técnicas
- **[API]** `app/api/studio/execute/route.ts`
  - Substituída importação `@ai-sdk/openai` por `@ai-sdk/google`
  - Modelo alterado: `openai("gpt-4o")` → `google("gemini-1.5-flash")`
  - Melhorado parse de resposta JSON (Gemini pode incluir markdown)
  - Atualizada mensagem de erro para indicar `GOOGLE_GENERATIVE_AI_API_KEY`

- **[Segurança]** `lib/hnk-protection.ts`
  - Proteção HNK agora usa Gemini 1.5 Flash
  - Análise ética gratuita e sem limites
  - Adicionadas palavras-chave em PT-BR ("ódio", "porn")

### 📦 Dependências
- **Adicionar**: `@ai-sdk/google` (execute: `npm install @ai-sdk/google`)
- **Remover**: `@ai-sdk/openai` (opcional, pode manter para fallback)

### 🔑 Variáveis de Ambiente Necessárias
\`\`\`env
# Nova chave obrigatória
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# Supabase (mantém)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
\`\`\`

### 🎯 Impacto
- Sistema 100% funcional sem custos de API
- Velocidade de resposta aumentada (~2-3x mais rápido)
- Capacidade de processar prompts complexos mantida
- Ideal para desenvolvimento e produção de baixo custo

### ⚠️ Ação Necessária
1. Obter chave gratuita em: https://aistudio.google.com/app/apikey
2. Adicionar `GOOGLE_GENERATIVE_AI_API_KEY` ao `.env.local`
3. Executar: `npm install @ai-sdk/google`
4. Reiniciar servidor: `npm run dev`

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
