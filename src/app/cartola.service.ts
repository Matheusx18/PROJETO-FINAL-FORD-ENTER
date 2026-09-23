import { Injectable } from '@angular/core';

export interface Player {
  id: string;
  nome: string;
  posicao: 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA';
  mensalidadePaga: boolean;
  gols: number;
  assistencias: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  nota: number;
}

export interface LigaAdmin {
  nomeAdm: string;
  email: string;
  codigoLiga: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartolaService {
  private storagePlayersKey = 'baba_cartola_players_v7';
  private storageLigasKey = 'baba_cartola_ligas_v7';
  private storageLgpdKey = 'baba_cartola_lgpd_accepted';

  isAdmin: boolean = false;
  lgpdAceito: boolean = false;

  ligas: LigaAdmin[] = [
    { nomeAdm: 'Matheus Ferreira', email: 'matheus@baba.com', codigoLiga: 'BABA-2026' }
  ];

  players: Player[] = [
    { id: '1', nome: 'Matheus Ferreira', posicao: 'MEI', mensalidadePaga: true, gols: 2, assistencias: 1, cartoesAmarelos: 0, cartoesVermelhos: 0, nota: 9.0 },
    { id: '2', nome: 'Lucas Silva', posicao: 'ATA', mensalidadePaga: true, gols: 1, assistencias: 0, cartoesAmarelos: 1, cartoesVermelhos: 0, nota: 6.0 },
    { id: '3', nome: 'Gabriel Santos', posicao: 'ZAG', mensalidadePaga: true, gols: 0, assistencias: 1, cartoesAmarelos: 0, cartoesVermelhos: 0, nota: 6.0 },
    { id: '4', nome: 'Bruno Oliveira', posicao: 'GOL', mensalidadePaga: true, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, nota: 5.0 }
  ];

  constructor() {
    this.loadFromStorage();
    this.recalcularTodasNotas();
  }

  aceitarLgpd(): void {
    this.lgpdAceito = true;
    localStorage.setItem(this.storageLgpdKey, 'true');
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storagePlayersKey, JSON.stringify(this.players));
    localStorage.setItem(this.storageLigasKey, JSON.stringify(this.ligas));
  }

  private loadFromStorage(): void {
    this.lgpdAceito = localStorage.getItem(this.storageLgpdKey) === 'true';

    const pData = localStorage.getItem(this.storagePlayersKey);
    if (pData) {
      try { this.players = JSON.parse(pData); } catch (e) {}
    }
    const lData = localStorage.getItem(this.storageLigasKey);
    if (lData) {
      try { this.ligas = JSON.parse(lData); } catch (e) {}
    }
  }

  cadastrarLigaAdmin(nomeAdm: string, email: string): string {
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const codigoLiga = `BABA-${randomHex}`;
    const novaLiga: LigaAdmin = { nomeAdm, email, codigoLiga };
    this.ligas.push(novaLiga);
    this.saveToStorage();
    return codigoLiga;
  }

  validarLoginAdmin(email: string, codigo: string): boolean {
    if (!email || !codigo) return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = codigo.trim().toUpperCase();
    return this.ligas.some(l => l.email.toLowerCase() === cleanEmail && l.codigoLiga.toUpperCase() === cleanCode);
  }

  validarCodigoLiga(codigo: string): boolean {
    if (!codigo) return false;
    const cleanCode = codigo.trim().toUpperCase();
    return this.ligas.some(l => l.codigoLiga.toUpperCase() === cleanCode);
  }

  addPlayer(dados: { nome: string; posicao: 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA'; mensalidadePaga: boolean }): void {
    if (!this.isAdmin) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      nome: dados.nome,
      posicao: dados.posicao,
      mensalidadePaga: dados.mensalidadePaga,
      gols: 0,
      assistencias: 0,
      cartoesAmarelos: 0,
      cartoesVermelhos: 0,
      nota: 5.0
    };
    this.players.push(newPlayer);
    this.saveToStorage();
  }

  toggleMensalidade(id: string): void {
    if (!this.isAdmin) return;
    const p = this.players.find(x => x.id === id);
    if (p) {
      p.mensalidadePaga = !p.mensalidadePaga;
      this.saveToStorage();
    }
  }

  updateScouts(id: string, scouts: { gols: number; assistencias: number; cartoesAmarelos: number; cartoesVermelhos: number }): void {
    if (!this.isAdmin) return;
    const p = this.players.find(x => x.id === id);
    if (p) {
      p.gols = Math.max(0, Number(scouts.gols) || 0);
      p.assistencias = Math.max(0, Number(scouts.assistencias) || 0);
      p.cartoesAmarelos = Math.max(0, Number(scouts.cartoesAmarelos) || 0);
      p.cartoesVermelhos = Math.max(0, Number(scouts.cartoesVermelhos) || 0);
      this.recalcularNota(p);
      this.saveToStorage();
    }
  }

  recalcularNota(p: Player): void {
    let base = 5.0;
    base += (p.gols * 1.5);
    base += (p.assistencias * 1.0);
    base -= (p.cartoesAmarelos * 0.5);
    base -= (p.cartoesVermelhos * 2.0);
    
    const notaFinal = Math.min(10.0, Math.max(0.0, base));
    p.nota = Number(notaFinal.toFixed(1));
  }

  recalcularTodasNotas(): void {
    this.players.forEach(p => this.recalcularNota(p));
    this.saveToStorage();
  }

  deletePlayer(id: string): void {
    if (!this.isAdmin) return;
    this.players = this.players.filter(x => x.id !== id);
    this.saveToStorage();
  }

  getPlayersSortedByNota(): Player[] {
    return [...this.players].sort((a, b) => b.nota - a.nota);
  }
}