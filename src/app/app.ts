import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartolaService, Player } from './cartola.service';
import { CadastroJogadorComponent } from './components/cadastro-jogador/cadastro-jogador';
import { ScoutPartidaComponent } from './components/scout-partida/scout-partida';
import { SorteioTimesComponent } from './components/sorteio-times/sorteio-times';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CadastroJogadorComponent,
    ScoutPartidaComponent,
    SorteioTimesComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  currentTab: string = 'dashboard';
  isLoggedIn: boolean = false;
  isRegisterMode: boolean = false;

  loginRole: 'jogador' | 'admin' = 'jogador';
  loginNome: string = '';
  loginAdminEmail: string = '';
  loginCodigoLiga: string = '';
  loginErrorMessage: string = '';

  lgpdTermosAceito: boolean = false;

  regNome: string = '';
  regEmail: string = '';
  generatedCodigoLiga: string = '';

  session = {
    nome: '',
    perfil: '',
    codigoLiga: ''
  };

  valorMensalidade: number = 50.0;

  constructor(public cartolaService: CartolaService) {}

  switchTab(tab: string): void {
    this.currentTab = tab;
  }

  entrarComCodigo(): void {
    this.loginErrorMessage = '';

    if (!this.lgpdTermosAceito) {
      this.loginErrorMessage = 'Você deve concordar com os Termos da LGPD para continuar.';
      return;
    }

    if (this.loginRole === 'admin') {
      if (!this.loginAdminEmail.trim() || !this.loginCodigoLiga.trim()) {
        this.loginErrorMessage = 'Insira o seu Email de ADM e o Código da Liga.';
        return;
      }
      const isAdmValid = this.cartolaService.validarLoginAdmin(this.loginAdminEmail, this.loginCodigoLiga);
      if (!isAdmValid) {
        this.loginErrorMessage = 'Email ou Código de ADM incorretos!';
        return;
      }

      this.cartolaService.isAdmin = true;
      this.cartolaService.aceitarLgpd();
      this.session = {
        nome: this.loginAdminEmail.split('@')[0],
        perfil: 'Administrador (Modo Edição)',
        codigoLiga: this.loginCodigoLiga.toUpperCase()
      };
      this.isLoggedIn = true;

    } else {
      if (!this.loginNome.trim() || !this.loginCodigoLiga.trim()) {
        this.loginErrorMessage = 'Insira o seu Nome e o Código da Liga.';
        return;
      }
      const isValid = this.cartolaService.validarCodigoLiga(this.loginCodigoLiga);
      if (!isValid) {
        this.loginErrorMessage = 'Código de Liga inválido! Solicite o código ao seu ADM.';
        return;
      }

      this.cartolaService.isAdmin = false;
      this.cartolaService.aceitarLgpd();
      this.session = {
        nome: this.loginNome,
        perfil: 'Jogador (Modo Espectador)',
        codigoLiga: this.loginCodigoLiga.toUpperCase()
      };
      this.isLoggedIn = true;
    }
  }

  cadastrarNovoAdmin(): void {
    if (!this.lgpdTermosAceito) {
      alert('Você precisa concordar com os Termos da LGPD para criar a liga.');
      return;
    }

    if (!this.regNome.trim() || !this.regEmail.trim()) {
      alert('Preencha o nome e o email para gerar a sua chave de ADM.');
      return;
    }

    const novoCodigo = this.cartolaService.cadastrarLigaAdmin(this.regNome, this.regEmail);
    this.generatedCodigoLiga = novoCodigo;
    this.loginAdminEmail = this.regEmail;
    this.loginCodigoLiga = novoCodigo;
    this.loginRole = 'admin';
    this.cartolaService.aceitarLgpd();
  }

  toggleRegisterMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.loginErrorMessage = '';
    this.generatedCodigoLiga = '';
  }

  logout(): void {
    this.isLoggedIn = false;
    this.cartolaService.isAdmin = false;
    this.loginNome = '';
    this.loginAdminEmail = '';
    this.loginCodigoLiga = '';
    this.loginErrorMessage = '';
  }

  getTotalArrecadado(): number {
    const pagosCount = this.cartolaService.players.filter(p => p.mensalidadePaga).length;
    return pagosCount * this.valorMensalidade;
  }

  getInadimplenciaCount(): number {
    return this.cartolaService.players.filter(p => !p.mensalidadePaga).length;
  }

  getRankingJogadores(): Player[] {
    return this.cartolaService.getPlayersSortedByNota();
  }
}