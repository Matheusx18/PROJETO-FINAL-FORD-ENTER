import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartolaService, Player, PlayerStats } from '../../cartola.service';

@Component({
  selector: 'app-scout-partida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scout-partida.html',
  styleUrls: ['./scout-partida.css']
})
export class ScoutPartidaComponent {
  @Input() userPerfil: 'Administrador' | 'Associado' = 'Associado';
  jogadores: Player[] = [];

  constructor(public cartolaService: CartolaService) {
    this.cartolaService.players$.forEach(p => this.jogadores = p);
    this.jogadores = this.cartolaService.getPlayers();
  }

  alterarScout(player: Player, field: keyof PlayerStats, delta: number) {
    if (this.userPerfil !== 'Administrador') {
      alert('Apenas administradores podem alterar as estatísticas de scout.');
      return;
    }
    const currentVal = Number(player.estatisticas[field] || 0);
    const newVal = Math.max(0, currentVal + delta);
    const updatedStats: PlayerStats = {
      ...player.estatisticas,
      [field]: newVal
    };
    this.cartolaService.atualizarEstatisticas(player.id, updatedStats);
  }
}