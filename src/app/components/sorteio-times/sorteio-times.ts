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
  numTimes: number = 2;
  timesSorteados: Player[][] = [];

  constructor(public cartolaService: CartolaService) {}

  sortearEquipas(): void {
    const presentes = this.cartolaService.players.filter(p => p.presente);
    if (presentes.length < this.numTimes) {
      alert('Não há jogadores suficientes selecionados para formar os times.');
      return;
    }

    const jogEmbaralhados = [...presentes];
    for (let i = jogEmbaralhados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [jogEmbaralhados[i], jogEmbaralhados[j]] = [jogEmbaralhados[j], jogEmbaralhados[i]];
    }

    jogEmbaralhados.sort((a, b) => b.nota - a.nota);

    const times: Player[][] = Array.from({ length: Number(this.numTimes) }, () => []);

    jogEmbaralhados.forEach(jogador => {
      let menorTimeIndex = 0;
      let menorSoma = Infinity;

      const timeIndices = Array.from({ length: Number(this.numTimes) }, (_, idx) => idx)
        .sort(() => Math.random() - 0.5);

      timeIndices.forEach(idx => {
        const somaAtual = times[idx].reduce((acc, p) => acc + p.nota, 0);
        if (somaAtual < menorSoma) {
          menorSoma = somaAtual;
          menorTimeIndex = idx;
        }
      });

      times[menorTimeIndex].push(jogador);
    });

    this.timesSorteados = times;
  }

  getMediaTime(time: Player[]): string {
    if (time.length === 0) return '0.0';
    const soma = time.reduce((acc, p) => acc + p.nota, 0);
    return (soma / time.length).toFixed(1);
  }
}