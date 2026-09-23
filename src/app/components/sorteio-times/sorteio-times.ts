import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartolaService, Player } from '../../cartola.service';

@Component({
  selector: 'app-sorteio-times',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sorteio-times.html',
  styleUrls: ['./sorteio-times.css']
})
export class SorteioTimesComponent {
  selectedPlayers: { [key: string]: boolean } = {};
  numTimes: number = 2;
  timesGerados: { nome: string; jogadores: Player[]; mediaNota: number }[] = [];

  constructor(public cartolaService: CartolaService) {
    this.cartolaService.players.forEach(p => {
      this.selectedPlayers[p.id] = true;
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  sortear(): void {
    const presentes = this.cartolaService.players.filter(p => this.selectedPlayers[p.id]);
    if (presentes.length < this.numTimes) {
      alert(`Tens de selecionar pelo menos ${this.numTimes} jogadores para fazer o sorteio.`);
      return;
    }

    const embaralhados = this.shuffleArray(presentes);

    const equipas: { nome: string; jogadores: Player[]; mediaNota: number }[] = Array.from(
      { length: this.numTimes },
      (_, i) => ({ nome: `Time ${String.fromCharCode(65 + i)}`, jogadores: [], mediaNota: 0 })
    );

    embaralhados.forEach((jogador, index) => {
      const idxEquipa = index % this.numTimes;
      equipas[idxEquipa].jogadores.push(jogador);
    });

    equipas.forEach(eq => {
      const soma = eq.jogadores.reduce((acc, j) => acc + j.nota, 0);
      eq.mediaNota = Number((soma / eq.jogadores.length).toFixed(1));
    });

    this.timesGerados = equipas;
  }
}