import { appendFile, exists, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const raizProjeto = resolve(import.meta.dir, '../../');

/**
 * Classe responsável pelo Banco de Dados próprio em TXT
 */
export class TxtDB {
  // DIRETÓRIOS
  dirBanco = resolve(raizProjeto, 'db');
  dirTabelas = resolve(this.dirBanco, 'tables');

  // TABELAS
  tabelaContasReceber = Bun.file(`${this.dirTabelas}/contasreceber.txt`);

  // MÈTODOS

  async inicializar(): Promise<void> {
    // Criar os diretórios do Banco de Dados
    await mkdir(this.dirTabelas, { recursive: true });

    // Criar a tabela do Contas a Receber caso não exista
    if (!(await this.tabelaContasReceber.exists())) {
      await Bun.write(this.tabelaContasReceber, '');
    }

    console.log('O Banco de Dados foi inicializado com sucesso!');
  }
}
