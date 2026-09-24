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
  selectedPlayer: Player | null = null;
  scoutEdit = { gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0 };

  constructor(public cartolaService: CartolaService) {}

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
    this.scoutEdit = {
      gols: player.gols,
      assistencias: player.assistencias,
      cartoesAmarelos: player.cartoesAmarelos,
      cartoesVermelhos: player.cartoesVermelhos
    };
  }

  salvarScout(): void {
    if (this.selectedPlayer) {
      this.cartolaService.updateScouts(String(this.selectedPlayer.id), this.scoutEdit);
      this.selectedPlayer = null;
    }
  }
}