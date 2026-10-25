# BunDB 📦⚡

Laboratório de engenharia de software para estudo prático do runtime **Bun**, manipulação nativa de **I/O no sistema de arquivos (FS)** e modelagem de **regras de negócio financeiras** (Contas a Pagar e Receber) em TypeScript.

---

## 🎯 Propósito do Projeto

O objetivo principal não é competir com bancos de dados de produção (como Postgres ou SQLite), mas **abrir a caixa-preta** de fundamentos da computação:
1. **Runtime Bun:** Explorar o ecossistema do Bun, `Bun.serve()`, `bun:test` e as APIs nativas de alta performance (`Bun.file`, `Bun.write`, streams).
2. **I/O & Persistência Manual:** Construir um motor de banco de dados baseado em arquivos de texto (flat-file / NDJSON), lidando com concorrência, integridade de escrita e busca sem auxílio de ORMs.
3. **Regras de Negócio Ricas (Domínio Financeiro):** Modelar um sistema de Contas a Pagar e Receber com máquina de estados finita, precisão monetária em centavos, baixas parciais/totais, juros por atraso, multas e estornos.
4. **Arquitetura Desacoplada:** Garantir que o domínio financeiro seja puro e testável em memória, desacoplado do mecanismo de persistência em disco (padrão Repositório).

---

## 🧭 Guias e Especificações de Estudo

Todo o planejamento e documentação conceitual estão organizados na pasta [`specs/`](./specs):

- **[`specs/proposito.md`](./specs/proposito.md):** Visão completa, objetivos de aprendizagem e limites do projeto.
- **[`specs/trilha-estudos.md`](./specs/trilha-estudos.md):** Roteiro passo a passo com desafios graduais (Storage -> Domínio -> Repositório -> HTTP).
- **[`specs/engine-txt.md`](./specs/engine-txt.md):** Perguntas arquiteturais, formatos de serialização (NDJSON, append-only) e integridade.
- **[`specs/dominio-financeiro.md`](./specs/dominio-financeiro.md):** Regras de negócio, invariantes, máquina de estados e cálculos de baixa/mora.
- **[`specs/diario-bordo.md`](./specs/diario-bordo.md):** Registro de descobertas, pegadinhas de runtime e lições aprendidas.

---

## 🚀 Comandos Rápidos

```bash
# Instalar dependências
bun install

# Executar servidor em modo de desenvolvimento com hot-reload
bun run dev:watch

# Rodar a suíte de testes
bun test

# Verificar tipos
bun run typecheck
```
