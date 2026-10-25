# Trilha de Estudos & Desafios Incrementais — BunDB

Esta trilha organiza os passos práticos em fases. Cada fase é pensada para ser executada em blocos de estudo focados, permitindo consolidar os conceitos antes de dar o próximo passo.

---

## Fase 1: Fundação do Engine de Armazenamento (I/O & Bun)

**Objetivo:** Ter um motor simples e confiável para salvar e ler dados em arquivos de texto sem acoplamento a um domínio específico.

- [ ] **Desafio 1.1: Resolução Robusta de Caminhos**
  - Investigar como o Bun e o Node tratam caminhos relativos (`import.meta.dir`, `process.cwd()`, `path.resolve`).
  - Garantir que o banco de dados salve os arquivos no lugar correto, independente de onde o comando `bun run` foi chamado no terminal.
- [ ] **Desafio 1.2: Leitura e Escrita Básica com APIs do Bun**
  - Implementar métodos de salvar um registro e buscar por ID usando `Bun.file()` e `Bun.write()`.
  - Definir o formato de serialização (recomendação inicial: **NDJSON** - uma linha por JSON).
- [ ] **Desafio 1.3: Listagem e Append**
  - Implementar a listagem de todos os registros de uma tabela (leitura linha a linha).
  - Implementar inserção no final do arquivo sem precisar reescrever o arquivo inteiro a cada `insert`.
- [ ] **Desafio 1.4: Teste de Concorrência Simples**
  - Criar um script ou teste com `bun test` disparando 50 escritas simultâneas com `Promise.all` para ver se o arquivo corrompe ou perde dados.

---

## Fase 2: Modelagem Pura do Domínio Financeiro (Regras de Negócio)

**Objetivo:** Construir as entidades e regras de Contas a Pagar e Receber de forma pura em TypeScript, com testes de unidade e sem tocar no disco.

- [ ] **Desafio 2.1: Entidade e Tipagem de Conta / Título**
  - Definir os tipos: `TipoConta` (`PAGAR` | `RECEBER`), `StatusConta`, campos de valor em centavos (`valorOriginalCentavos`), datas.
  - Implementar validações de criação (valor positivo, descrição não vazia, datas válidas).
- [ ] **Desafio 2.2: Máquina de Estados e Baixa Parcial/Total**
  - Implementar a função/método para registrar um pagamento (baixa).
  - Garantir a transição correta: `PENDENTE -> PARCIALMENTE_PAGA -> LIQUIDADA`.
  - Impedir baixas com valor superior ao saldo devedor ou em contas canceladas.
- [ ] **Desafio 2.3: Juros e Multas por Vencimento**
  - Criar regra para calcular o saldo devedor na data de pagamento: se pago após o vencimento, aplicar multa e juros de mora proporcionais aos dias de atraso.
- [ ] **Desafio 2.4: Testes Unitários de Domínio**
  - Escrever testes em `bun:test` cobrindo cenários de sucesso, cenários de erro (tentativa de pagar a mais, pagar conta cancelada) e cálculo de juros.

---

## Fase 3: Conexão entre Domínio e Persistência (Padrão Repositório)

**Objetivo:** Fazer o domínio financeiro salvar e recuperar suas contas usando o motor de TXT, mantendo o desacoplamento.

- [ ] **Desafio 3.1: Interface de Repositório**
  - Criar um contrato/interface: `ContaRepository` (`salvar(conta)`, `buscarPorId(id)`, `listarTodas()`, `listarPorStatus(status)`).
- [ ] **Desafio 3.2: Implementação do Repositório com TxtDB**
  - Implementar a serialização da entidade para a linha do TXT e a desserialização do TXT de volta para a entidade rica com seus métodos de negócio.
- [ ] **Desafio 3.3: Atualização de Registro no Arquivo**
  - Como atualizar uma conta no arquivo TXT após uma baixa? (Decidir entre: reescrever o arquivo com a linha modificada ou estratégia append-only com status mais recente).

---

## Fase 4: Interface de Entrada (API HTTP com Bun.serve ou CLI)

**Objetivo:** Permitir que o usuário ou cliente externo interaja com o sistema.

- [ ] **Desafio 4.1: Rotas Financeiras no `Bun.serve()`**
  - `POST /contas`: Criar nova conta.
  - `GET /contas`: Listar contas com filtro por status.
  - `POST /contas/:id/baixa`: Registrar pagamento.
  - `GET /contas/:id`: Detalhes e saldo devedor calculado hoje.
- [ ] **Desafio 4.2: Validação de Payload de Entrada**
  - Usar schemas (TypeBox já instalado ou validação manual) para garantir que valores e tipos na requisição estejam corretos antes de chamar o domínio.
- [ ] **Desafio 4.3: Documentação OpenAPI viva**
  - Manter o endpoint `/openapi.json` refletindo as rotas reais do módulo financeiro.
