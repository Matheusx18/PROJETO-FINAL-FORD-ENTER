import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartolaService } from './cartola.service';
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
  isLoggedIn: boolean = false;
  isRegisterMode: boolean = false;
  loginRole: 'jogador' | 'admin' = 'jogador';
  loginNome: string = '';
  loginAdminEmail: string = '';
  loginCodigoLiga: string = '';
  lgpdTermosAceito: boolean = false;
  loginErrorMessage: string = '';

  regNome: string = '';
  regEmail: string = '';
  generatedCodigoLiga: string = '';

  session = {
    nome: '',
    perfil: '',
    codigoLiga: ''
  };

  currentTab: string = 'dashboard';
  isSidebarCollapsed: boolean = false;

  constructor(public cartolaService: CartolaService) {}

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  switchTab(tab: string): void {
    this.currentTab = tab;
  }

  entrarComCodigo(): void {
    if (!this.lgpdTermosAceito) {
      this.loginErrorMessage = 'Você precisa aceitar os Termos de Privacidade para continuar.';
      return;
    }

    if (!this.loginCodigoLiga.trim()) {
      this.loginErrorMessage = 'Informe o código da liga.';
      return;
    }

    this.session = {
      nome: this.loginRole === 'admin' ? (this.loginAdminEmail || 'Administrador') : (this.loginNome || 'Atleta'),
      perfil: this.loginRole === 'admin' ? 'Administrador' : 'Atleta',
      codigoLiga: this.loginCodigoLiga.toUpperCase()
    };

    this.cartolaService.isAdmin = (this.loginRole === 'admin');
    this.isLoggedIn = true;
    this.loginErrorMessage = '';
  }

  cadastrarNovoAdmin(): void {
    if (!this.lgpdTermosAceito) {
      alert('Você precisa aceitar os Termos de Uso.');
      return;
    }

    if (!this.regNome.trim() || !this.regEmail.trim()) {
      alert('Preencha o nome e o e-mail do administrador.');
      return;
    }

    const randomCode = 'BABA-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    this.generatedCodigoLiga = randomCode;
    this.loginCodigoLiga = randomCode;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.loginNome = '';
    this.loginAdminEmail = '';
    this.loginCodigoLiga = '';
    this.lgpdTermosAceito = false;
  }

  getTotalArrecadado(): number {
    return this.cartolaService.players.filter(p => p.mensalidadePaga).length * 50;
  }

  getInadimplenciaCount(): number {
    return this.cartolaService.players.filter(p => !p.mensalidadePaga).length;
  }

  getRankingJogadores(): any[] {
    return [...this.cartolaService.players].sort((a, b) => b.nota - a.nota);
  }
}