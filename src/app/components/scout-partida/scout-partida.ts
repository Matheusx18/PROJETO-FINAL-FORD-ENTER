import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartolaService, Player } from '../../cartola.service';

@Component({
  selector: 'app-scout-partida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scout-partida.html',
  styleUrls: ['./scout-partida.css']
})
export class ScoutPartidaComponent {
  selectedPlayerId: string = '';
  selectedPlayer: Player | null = null;

  scoutForm = {
    gols: 0,
    assistencias: 0,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0
  };

  constructor(public cartolaService: CartolaService) {}

  selecionarAtleta(player: Player): void {
    this.selectedPlayerId = player.id;
    this.selectedPlayer = player;

    this.scoutForm = {
      gols: player.gols,
      assistencias: player.assistencias,
      cartoesAmarelos: player.cartoesAmarelos,
      cartoesVermelhos: player.cartoesVermelhos
    };
  }

  calcularNotaPrevia(): string {
    let base = 5.0;
    base += (Number(this.scoutForm.gols) || 0) * 1.5;
    base += (Number(this.scoutForm.assistencias) || 0) * 1.0;
    base -= (Number(this.scoutForm.cartoesAmarelos) || 0) * 0.5;
    base -= (Number(this.scoutForm.cartoesVermelhos) || 0) * 2.0;

    const notaFinal = Math.min(10.0, Math.max(0.0, base));
    return notaFinal.toFixed(1);
  }

  salvarScout(): void {
    if (!this.selectedPlayerId) return;

    this.cartolaService.updateScouts(this.selectedPlayerId, this.scoutForm);
    alert('Scout e Nota atualizados com sucesso!');
  }
}