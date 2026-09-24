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
  presente: boolean;
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
  private storageLigasKey = 'baba_cartola_ligas_v9';
  private storageLgpdKey = 'baba_cartola_lgpd_accepted';

  isAdmin: boolean = false;
  lgpdAceito: boolean = false;
  currentCodigoLiga: string = '';

  ligas: LigaAdmin[] = [
    { nomeAdm: 'Matheus Ferreira', email: 'matheus@baba.com', codigoLiga: 'BABA-2026' }
  ];

  private defaultPlayers: Player[] = [
    { id: '1', nome: 'Matheus', posicao: 'MEI', mensalidadePaga: true, gols: 2, assistencias: 1, cartoesAmarelos: 0, cartoesVermelhos: 0, nota: 9.0, presente: true },
    { id: '2', nome: 'Lucas Silva', posicao: 'ATA', mensalidadePaga: true, gols: 1, assistencias: 0, cartoesAmarelos: 1, cartoesVermelhos: 0, nota: 6.0, presente: true },
    { id: '3', nome: 'Gabriel Santos', posicao: 'ZAG', mensalidadePaga: true, gols: 0, assistencias: 1, cartoesAmarelos: 1, cartoesVermelhos: 0, nota: 6.0, presente: false },
    { id: '4', nome: 'Bruno Oliveira', posicao: 'GOL', mensalidadePaga: true, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, nota: 5.0, presente: true }
  ];

  players: Player[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private validarFormatoEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
  }

  selecionarLiga(codigoLiga: string, isAdmin: boolean): void {
    this.currentCodigoLiga = codigoLiga.trim().toUpperCase();
    this.isAdmin = isAdmin;
    this.carregarJogadoresDaLiga();
  }

  aceitarLgpd(): void {
    this.lgpdAceito = true;
    localStorage.setItem(this.storageLgpdKey, 'true');
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageLigasKey, JSON.stringify(this.ligas));
    if (this.currentCodigoLiga) {
      const keyLiga = `baba_players_${this.currentCodigoLiga}`;
      localStorage.setItem(keyLiga, JSON.stringify(this.players));
    }
  }

  private loadFromStorage(): void {
    this.lgpdAceito = localStorage.getItem(this.storageLgpdKey) === 'true';
    const lData = localStorage.getItem(this.storageLigasKey);
    if (lData) {
      try {
        this.ligas = JSON.parse(lData);
      } catch (e) {}
    }
  }

  private carregarJogadoresDaLiga(): void {
    if (!this.currentCodigoLiga) return;
    const keyLiga = `baba_players_${this.currentCodigoLiga}`;
    const pData = localStorage.getItem(keyLiga);
    if (pData) {
      try {
        this.players = JSON.parse(pData);
      } catch (e) {
        this.players = [];
      }
    } else {
      this.players = JSON.parse(JSON.stringify(this.defaultPlayers));
      this.saveToStorage();
    }
  }

  // CADASTRO DE ADM BLOQUEANDO E-MAILS FALSOS
  cadastrarLigaAdmin(nome: string, email: string): string | null {
    const cleanNome = nome.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Se o e-mail for inválido (ex: "dfsdfsdf"), rejeita na hora!
    if (!this.validarFormatoEmail(cleanEmail)) {
      return null; 
    }

    const existe = this.ligas.find(l => l.email.toLowerCase() === cleanEmail);
    if (existe) {
      return existe.codigoLiga;
    }

    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const codigoLiga = `BABA-${randomHex}`;

    const novaLiga: LigaAdmin = {
      nomeAdm: cleanNome,
      email: cleanEmail,
      codigoLiga: codigoLiga
    };

    this.ligas.push(novaLiga);
    this.saveToStorage();
    this.selecionarLiga(codigoLiga, true);
    return codigoLiga;
  }

  validarLoginAdmin(email: string, codigo: string): boolean {
    if (!email || !codigo) return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = codigo.trim().toUpperCase();

    if (!this.validarFormatoEmail(cleanEmail)) return false;

    const ligaEncontrada = this.ligas.find(
      l => l.email.toLowerCase() === cleanEmail && l.codigoLiga.toUpperCase() === cleanCode
    );

    if (ligaEncontrada) {
      this.selecionarLiga(ligaEncontrada.codigoLiga, true);
      return true;
    }
    return false;
  }

  validarCodigoLiga(codigo: string): boolean {
    if (!codigo) return false;
    const cleanCode = codigo.trim().toUpperCase();
    const ligaEncontrada = this.ligas.find(l => l.codigoLiga.toUpperCase() === cleanCode);

    if (ligaEncontrada) {
      this.selecionarLiga(ligaEncontrada.codigoLiga, false);
      return true;
    }
    return false;
  }

  addPlayer(dados: { nome: string; posicao: 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA'; mensalidadePaga: boolean }): void {
    if (!this.isAdmin) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      nome: dados.nome.trim(),
      posicao: dados.posicao,
      mensalidadePaga: dados.mensalidadePaga,
      gols: 0,
      assistencias: 0,
      cartoesAmarelos: 0,
      cartoesVermelhos: 0,
      nota: 5.0,
      presente: true
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

  private recalcularNota(p: Player): void {
    let base = 5.0;
    base += (p.gols * 1.5);
    base += (p.assistencias * 1.0);
    base -= (p.cartoesAmarelos * 0.5);
    base -= (p.cartoesVermelhos * 2.0);
    p.nota = Number(Math.min(10.0, Math.max(0.0, base)).toFixed(1));
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