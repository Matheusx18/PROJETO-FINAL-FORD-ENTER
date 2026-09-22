import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartolaService, Player, Position } from '../../cartola.service';

@Component({
  selector: 'app-cadastro-jogador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-jogador.html',
  styleUrls: ['./cadastro-jogador.css']
})
export class CadastroJogadorComponent {
  @Input() userPerfil: 'Administrador' | 'Associado' = 'Associado';
  
  jogadores: Player[] = [];

  novoJogador = {
    nome: '',
    apelido: '',
    posicao: 'Meia' as Position,
    numeroCamisa: 10,
    status: 'Ativo' as const,
    statusPagamento: 'Pago' as const,
    estatisticas: { gols: 0, assistencias: 0, desarmes: 0, interceptacoes: 0, faltas: 0 }
  };

  constructor(public cartolaService: CartolaService) {
    this.cartolaService.players$.forEach(p => this.jogadores = p);
    this.jogadores = this.cartolaService.getPlayers();
  }

  cadastrar() {
    if (!this.novoJogador.nome) {
      alert('Informe o nome do atleta.');
      return;
    }
    this.cartolaService.addPlayer(this.novoJogador);
    this.novoJogador.nome = '';
    this.novoJogador.apelido = '';
    alert('Atleta cadastrado com sucesso!');
  }

  excluir(id: string) {
    if (this.userPerfil !== 'Administrador') {
      alert('Apenas administradores podem excluir atletas.');
      return;
    }
    if (confirm('Deseja realmente excluir este atleta?')) {
      this.cartolaService.deletePlayer(id);
    }
  }
}