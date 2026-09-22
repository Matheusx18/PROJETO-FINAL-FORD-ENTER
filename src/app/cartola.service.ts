import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Position = 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Volante' | 'Meia' | 'Atacante';
export type PlayerStatus = 'Ativo' | 'Inativo' | 'Suspenso';
export type PaymentStatus = 'Pago' | 'Pendente' | 'Atrasado';

export interface PlayerStats {
  gols: number;
  assistencias: number;
  desarmes: number;
  interceptacoes: number;
  faltas: number;
  golsSofridos?: number;
  defesasDificeis?: number;
  penaltisDefendidos?: number;
}

export interface Player {
  id: string;
  nome: string;
  apelido: string;
  posicao: Position;
  numeroCamisa: number;
  status: PlayerStatus;
  statusPagamento: PaymentStatus;
  notaGeral: number;
  estatisticas: PlayerStats;
}

@Injectable({
  providedIn: 'root'
})
export class CartolaService {
  private storageKey = 'cartola_baba_players_v1';

  private defaultPlayers: Player[] = [
    { id: '1', nome: 'Jadson Sales', apelido: 'Craque', posicao: 'Meia', numeroCamisa: 10, status: 'Ativo', statusPagamento: 'Pago', notaGeral: 8.5, estatisticas: { gols: 3, assistencias: 5, desarmes: 2, interceptacoes: 1, faltas: 1 } },
    { id: '2', nome: 'Marcos Silva', apelido: 'Paredão', posicao: 'Goleiro', numeroCamisa: 1, status: 'Ativo', statusPagamento: 'Pago', notaGeral: 9.0, estatisticas: { gols: 0, assistencias: 0, desarmes: 0, interceptacoes: 0, faltas: 0, golsSofridos: 1, defesasDificeis: 7, penaltisDefendidos: 1 } },
    { id: '3', nome: 'Carlos Souza', apelido: 'Bezerro', posicao: 'Zagueiro', numeroCamisa: 4, status: 'Ativo', statusPagamento: 'Atrasado', notaGeral: 6.8, estatisticas: { gols: 1, assistencias: 0, desarmes: 10, interceptacoes: 6, faltas: 3 } },
    { id: '4', nome: 'Lucas Lima', apelido: 'Foguete', posicao: 'Atacante', numeroCamisa: 7, status: 'Ativo', statusPagamento: 'Pago', notaGeral: 8.2, estatisticas: { gols: 5, assistencias: 1, desarmes: 1, interceptacoes: 0, faltas: 2 } }
  ];

  private playersSubject = new BehaviorSubject<Player[]>(this.loadFromStorage());
  players$: Observable<Player[]> = this.playersSubject.asObservable();

  constructor() {}

  private loadFromStorage(): Player[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.defaultPlayers;
  }

  private saveToStorage(players: Player[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(players));
    this.playersSubject.next(players);
  }

  getPlayers(): Player[] {
    return this.playersSubject.value;
  }

  addPlayer(player: Omit<Player, 'id' | 'notaGeral'>) {
    const current = this.getPlayers();
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString(),
      notaGeral: 6.0
    };
    this.saveToStorage([...current, newPlayer]);
  }

  deletePlayer(id: string) {
    const current = this.getPlayers().filter(p => p.id !== id);
    this.saveToStorage(current);
  }

  calcularNotaCartola(posicao: string, stats: PlayerStats): number {
    let base = 5.0;
    if (posicao === 'Goleiro') {
      base += (stats.defesasDificeis || 0) * 1.5 + (stats.penaltisDefendidos || 0) * 3.0 - (stats.golsSofridos || 0) * 1.0;
    } else {
      base += (stats.gols || 0) * 2.0 + (stats.assistencias || 0) * 1.5 + (stats.desarmes || 0) * 0.4 + (stats.interceptacoes || 0) * 0.3 - (stats.faltas || 0) * 0.3;
    }
    return Number(Math.min(Math.max(base, 0.0), 10.0).toFixed(1));
  }

  atualizarEstatisticas(playerId: string, newStats: PlayerStats) {
    const players = this.getPlayers().map(p => {
      if (p.id === playerId) {
        const novaNota = this.calcularNotaCartola(p.posicao, newStats);
        return {
          ...p,
          estatisticas: newStats,
          notaGeral: novaNota
        };
      }
      return p;
    });
    this.saveToStorage(players);
  }

  sortearTimes(selectedIds: string[]): { timeA: Player[], timeB: Player[] } {
    const all = this.getPlayers();
    const selected = all.filter(p => selectedIds.includes(p.id));
    selected.sort((a, b) => b.notaGeral - a.notaGeral);

    const timeA: Player[] = [];
    const timeB: Player[] = [];

    selected.forEach((player, index) => {
      if (index % 2 === 0) {
        if (timeA.length <= timeB.length) timeA.push(player);
        else timeB.push(player);
      } else {
        if (timeB.length <= timeA.length) timeB.push(player);
        else timeA.push(player);
      }
    });

    return { timeA, timeB };
  }
}