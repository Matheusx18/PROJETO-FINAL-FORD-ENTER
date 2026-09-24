import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartolaService } from '../../cartola.service';

@Component({
  selector: 'app-cadastro-jogador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-jogador.html',
  styleUrls: ['./cadastro-jogador.css']
})
export class CadastroJogadorComponent {
  novoNome: string = '';
  novaPosicao: 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA' = 'MEI';

  constructor(public cartolaService: CartolaService) {}

  adicionarAtleta(): void {
    if (!this.novoNome.trim()) return;
    
    this.cartolaService.addPlayer({
      nome: this.novoNome,
      posicao: this.novaPosicao,
      mensalidadePaga: true
    });

    this.novoNome = '';
    this.novaPosicao = 'MEI';
  }

  togglePagamento(player: any): void {
    this.cartolaService.toggleMensalidade(player.id);
  }

  removerAtleta(id: string): void {
    this.cartolaService.deletePlayer(String(id));
  }
}