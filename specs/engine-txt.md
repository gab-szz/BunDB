# Engine de Armazenamento em TXT — BunDB

Este documento reúne os conceitos de engenharia e as perguntas arquiteturais para a construção do motor de banco de dados baseado em arquivos de texto.

---

## 1. Perguntas Arquiteturais Fundamentais

Antes de escrever o código do storage, reflita sobre as seguintes decisões:

### A. Estratégia de Arquivo
- **Arquivo Único por Tabela:** Ex.: `db/tables/contas_pagar.txt`.
  - *Prós:* Simples de organizar e listar.
  - *Contras:* Leituras e atualizações parciais exigem processar o arquivo inteiro se não houver índice.
- **Arquivo por Registro:** Ex.: `db/tables/contas_pagar/{id}.txt`.
  - *Prós:* Atualizar um registro não afeta os outros; fácil remoção e leitura direta por ID.
  - *Contras:* Sobrecarga no sistema de arquivos para milhares de arquivos; listagens exigem varrer diretórios (`readdir`).
- **Append-Only Log (WAL - Write Ahead Log):**
  - Cada inserção, atualização ou cancelamento é uma nova linha no final do arquivo.
  - *Prós:* Escrita em alta velocidade; histórico completo de auditoria; difícil corromper dados antigos.
  - *Contras:* Para saber o estado atual, precisa reconstruir o registro lendo os eventos ou manter um snapshot/índice.

---

## 2. Formato de Serialização

Qual formato de linha utilizar dentro do `.txt`?

1. **NDJSON (Newline Delimited JSON):**
   - Cada linha é um objeto JSON válido terminado com `\n`.
   - Exemplo:
     ```json
     {"id":"1","tipo":"PAGAR","valorCentavos":15000,"status":"PENDENTE"}
     {"id":"2","tipo":"RECEBER","valorCentavos":50000,"status":"LIQUIDADO"}
     ```
   - *Por que estudar?* Fácil de inspecionar visualmente com qualquer editor, parse nativo (`JSON.parse` por linha), aceita campos aninhados.

2. **CSV / Delimitado por caractere (`|`, `;` ou `,`):**
   - Linha com cabeçalho ou posicional.
   - *Por que estudar?* Menor pegada em bytes, parse rápido por split de string, mas exige cuidado com escapes e novos campos.

---

## 3. Concorrência e Integridade de Dados

- **O que é Atomic Write?**
  - Se o processo cair ou a energia acabar enquanto você escreve um arquivo de 10 MB, metade do arquivo fica corrompida.
  - Técnica clássica: escrever em um arquivo temporário (`.tmp`) e depois usar `rename` (que é atômico no sistema de arquivos em sistemas POSIX).
- **Escritas Concorrentes:**
  - Se duas requisições tentarem atualizar a mesma conta ao mesmo tempo, como garantir que uma não sobrescreva a outra sem querer (*lost update*)?
  - Estratégias: Fila em memória (Promise chain / Queue de operações), lock de arquivo, ou controle de versão/optimistic locking (`version: 1 -> version: 2`).

---

## 4. APIs do Bun para Explorar

No Bun, existem APIs nativas que operam em velocidade nativa (C++/Zig):
- `Bun.file(caminho)`: Representa um ponteiro para um arquivo em disco.
- `await file.text()`: Lê o conteúdo completo como texto UTF-8.
- `await file.json()`: Lê e já faz o parse para JSON diretamente.
- `file.stream()`: Para ler arquivos grandes linha por linha sem carregar tudo na RAM.
- `Bun.write(caminho, dados)`: Escreve dados em disco de forma rápida.
- `file.writer()`: Cria um `FileSink` de alta performance para fazer múltiplos `write` seguidos (ideal para append-only logs).
