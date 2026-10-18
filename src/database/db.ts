import { appendFile, exists, mkdir, realpath } from 'node:fs/promises';

const caminhoDoProjeto = await realpath('../');

export class TxtDB {
  // DIRETÓRIOS
  diretorioBanco = `${caminhoDoProjeto}/db`;
  diretorioTabelas = `${this.diretorioBanco}/tables`;

  // TABELAS
  tabelaQueueConfig = `${this.diretorioTabelas}/queueConfig.txt`;

  // MÈTODOS

  async inicializar(): Promise<void> {
    // Criar diretório do Banco de Dados
    if (!(await exists(this.diretorioBanco))) {
      await mkdir(this.diretorioBanco);
      console.log('Diretório do Banco de Dados criado com sucesso!');
    }

    // Criar diretório de Tabelas e Tabelas
    if (!(await exists(this.diretorioTabelas))) {
      await mkdir(this.diretorioTabelas);
      await appendFile(this.tabelaQueueConfig, '');
      console.log('Tabelas criada com sucesso!');
    }

    console.log('O Banco de Dados foi inicializado com sucesso!');
  }
}
