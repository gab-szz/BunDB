# Propósito do Projeto — BunDB

## 1. O que é o BunDB?

O **BunDB** é um projeto laboratório para construir:
1. Um **motor de banco de dados artesanal baseado em sistema de arquivos** (flat-file / text-based) implementado em **TypeScript** e executado no runtime **Bun**.
2. Um **módulo de aplicação com regras de negócio ricas**, utilizando o domínio de **Contas a Pagar e Receber (Financeiro)** como caso de uso real.

Não é objetivo competir com SQLite, Postgres ou bancos de dados prontos. O objetivo é **abrir a caixa preta**: entender como I/O de disco funciona na prática, como lidar com integridade sem mágica de ORM e como modelar regras de negócio que não dependem do banco de dados.

---

## 2. Metas de Aprendizado

### A. Runtime Bun & I/O Nativo
- Compreender a diferença e o desempenho entre APIs do Node (`node:fs`) e APIs nativas do Bun (`Bun.file`, `Bun.write`, streaming com `FileSink`).
- Explorar concorrência e sincronização de escrita em disco no ambiente de thread única com loop de eventos.
- Lidar com caminhos de arquivos de forma robusta e independente de onde o script foi invocado.

### B. Fundamentos de Armazenamento & Banco de Dados
- Aprender sobre formatos de serialização para texto (NDJSON — *Newline Delimited JSON*, CSV, ou formato posicional).
- Compreender estratégias de persistência:
  - *Append-only log* (escrita rápida no final do arquivo, histórico de eventos).
  - *Rewrite atômico* (escrever em arquivo temporário e renomear para evitar corrupção).
  - *Índices simples em memória* (Map/Hash Table para evitar percorrer todo o arquivo a cada busca por ID).

### C. Regras de Negócio e Engenharia de Domínio
- Praticar **Domain-Driven Design (DDD) tático leve**: separar o que é Regra de Negócio (entidades, cálculos, validações) do que é Infraestrutura (salvar em arquivo, responder rota HTTP).
- Modelar uma **Máquina de Estados Finita** para títulos financeiros (Pendente, Pago Parcial, Liquidado, Atrasado, Cancelado).
- Compreender a precisão de cálculo monetário (evitar `0.1 + 0.2 = 0.30000000000000004` usando inteiros em centavos).

---

## 3. O que este projeto NÃO é

- **Não é um gerador de código por IA:** Todo código é pensado e escrito pelo estudante.
- **Não é um monolito acoplado ao arquivo TXT:** O módulo financeiro não deve "saber" que os dados estão em um `.txt`; ele deve interagir via interfaces/contratos de repositório.
- **Não é um CRUD genérico sem regras:** Cada operação financeira deve validar invariantes reais (datas, valores, transições de estado permitidas).
