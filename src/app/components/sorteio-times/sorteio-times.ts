import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartolaService, Player } from '../../cartola.service';

@Component({
  selector: 'app-sorteio-times',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sorteio-times.html',
  styleUrls: ['./sorteio-times.css']
})
export class SorteioTimesComponent {
  jogadores: Player[] = [];
  idsParaSorteio: string[] = [];
  timeA: Player[] = [];
  timeB: Player[] = [];

  constructor(public cartolaService: CartolaService) {
    this.cartolaService.players$.forEach(p => this.jogadores = p);
    this.jogadores = this.cartolaService.getPlayers();
  }

  toggleSelecao(id: string) {
    if (this.idsParaSorteio.includes(id)) {
      this.idsParaSorteio = this.idsParaSorteio.filter(i => i !== id);
    } else {
      this.idsParaSorteio.push(id);
    }
  }

  sortear() {
    if (this.idsParaSorteio.length < 4) {
      alert('Selecione pelo menos 4 atletas para o sorteio equilibrado!');
      return;
    }
    const res = this.cartolaService.sortearTimes(this.idsParaSorteio);
    this.timeA = res.timeA;
    this.timeB = res.timeB;
  }
}