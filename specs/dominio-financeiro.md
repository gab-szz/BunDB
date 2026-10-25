# Domínio Financeiro: Contas a Pagar e Receber

Este documento mapeia os conceitos de negócio, invariantes e fluxos do módulo financeiro.
O objetivo aqui é exercitar **modelagem rica de regras de negócio**, evitando o modelo anêmico de apenas salvar e ler campos.

---

## 1. Conceito Central: O que é um Título / Conta?

Uma conta (a pagar ou a receber) representa uma obrigação ou direito financeiro com data prevista e valor acordado.

- **Conta a Pagar:** Obrigação da empresa perante um terceiro (fornecedor, serviço, imposto). Representa saída futura de caixa.
- **Conta a Receber:** Direito da empresa perante um cliente ou terceiro. Representa entrada futura de caixa.

---

## 2. Invariantes de Negócio (Regras que NUNCA podem ser violadas)

1. **Valores Monetários:**
   - **Regra dos Centavos:** Valores monetários nunca devem ser representados por ponto flutuante (`float`/`number` com decimais) em cálculos, para evitar desvios de precisão (`0.1 + 0.2 != 0.3`). Devem ser armazenados e calculados em **inteiros representando centavos** (ex.: R$ 150,50 vira `15050`).
   - O valor original de um título deve ser estritamente maior que zero (`valorCentavos > 0`).

2. **Datas:**
   - **Data de Competência:** Quando o fato gerador ocorreu (ex.: emissão da nota).
   - **Data de Vencimento:** Data limite para pagamento sem incidência de juros ou multa.
   - **Data de Liquidação / Pagamento:** Quando o dinheiro efetivamente saiu ou entrou.

3. **Ciclo de Vida & Máquina de Estados:**
   - Estados possíveis:
     - `PENDENTE`: Conta criada, aguardando vencimento ou pagamento.
     - `PARCIALMENTE_PAGA`: Houve uma baixa inferior ao saldo restante.
     - `LIQUIDADA`: O valor total (original + juros/multas - descontos) foi pago.
     - `ATRASADA`: Passou do vencimento e o saldo ainda é positivo (estado temporal ou calculado).
     - `CANCELADA`: Título anulado por motivo documentado. Não pode mais receber baixas.

4. **Regras de Transição de Estado:**
   - Não é permitido pagar/baixar uma conta `CANCELADA` ou já `LIQUIDADA`.
   - Não é permitido cancelar uma conta com baixas efetuadas sem antes estornar as baixas.
   - O valor de uma baixa não pode exceder o saldo devedor atual do título.

---

## 3. Baixas, Juros, Multa e Desconto

Quando uma conta é paga, não basta alterar o status para `LIQUIDADA`. No mundo real ocorrem eventos de baixa:

- **Baixa Parcial:**
  - Conta de R$ 1.000,00 (`100000` centavos).
  - Pagamento de R$ 400,00 (`40000` centavos) no dia 10.
  - Saldo devedor restante: R$ 600,00 (`60000` centavos).
  - Status vai para `PARCIALMENTE_PAGA`.

- **Juros e Multa por Atraso:**
  - **Multa:** Percentual fixo aplicado uma única vez se pago após o vencimento (ex.: 2%).
  - **Juros diários (Mora):** Percentual aplicado por dia de atraso (ex.: 0,033% ao dia ou 1% ao mês pro-rata).
  - Cálculo:
    $$\text{Valor Total} = \text{Saldo Devedor} + \text{Multa} + \text{Juros} - \text{Desconto}$$

- **Estorno de Baixa:**
  - Se um pagamento foi registrado por engano, deve ser possível estornar a baixa, recalculando o saldo devedor e revertendo o status para `PENDENTE` ou `PARCIALMENTE_PAGA`.

---

## 4. Oportunidades de Prática de Código Limpo

- **Entidade Rica:** A classe `Conta` ou função de domínio deve conter métodos como:
  - `conta.registrarBaixa(valor, dataPagamento)`
  - `conta.cancelar(motivo)`
  - `conta.calcularSaldoDevedor(dataReferencia)`
  - `conta.obterStatusNaData(dataReferencia)`
- **Desacoplamento:** O domínio financeiro não deve importar `Bun.file` ou APIs de disco. Ele deve ser 100% testável em memória sem tocar no sistema de arquivos.
