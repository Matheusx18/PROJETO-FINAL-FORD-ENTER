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
      this.loginErrorMessage = 'Deve aceitar os Termos de Privacidade para continuar.';
      return;
    }

    if (this.loginRole === 'admin') {
      if (!this.loginAdminEmail.trim() || !this.loginCodigoLiga.trim()) {
        this.loginErrorMessage = 'Preencha o E-mail e o Código da Liga.';
        return;
      }

      const adminValido = this.cartolaService.validarLoginAdmin(this.loginAdminEmail, this.loginCodigoLiga);
      if (!adminValido) {
        this.loginErrorMessage = 'E-mail inválido ou incorreto, ou Código de Liga incorreto.';
        return;
      }

      this.session = {
        nome: this.loginAdminEmail,
        perfil: 'Administrador',
        codigoLiga: this.loginCodigoLiga.toUpperCase()
      };
    } else {
      if (!this.loginNome.trim() || !this.loginCodigoLiga.trim()) {
        this.loginErrorMessage = 'Preencha o seu Nome e o Código da Liga.';
        return;
      }

      const codigoValido = this.cartolaService.validarCodigoLiga(this.loginCodigoLiga);
      if (!codigoValido) {
        this.loginErrorMessage = 'Código de liga inexistente. Utilize um código válido gerado pelo sistema.';
        return;
      }

      this.session = {
        nome: this.loginNome,
        perfil: 'Atleta',
        codigoLiga: this.loginCodigoLiga.toUpperCase()
      };
    }

    this.isLoggedIn = true;
    this.loginErrorMessage = '';
  }

  cadastrarNovoAdmin(): void {
    if (!this.lgpdTermosAceito) {
      alert('Deve aceitar os Termos de Uso e Privacidade.');
      return;
    }

    if (!this.regNome.trim() || !this.regEmail.trim()) {
      alert('Preencha o Nome e o E-mail.');
      return;
    }

    const codigoGerado = this.cartolaService.cadastrarLigaAdmin(this.regNome, this.regEmail);
    
    if (!codigoGerado) {
      alert('E-mail inválido! Digite um endereço de e-mail real (ex: seu-email@gmail.com) para gerar o código.');
      return;
    }

    this.generatedCodigoLiga = codigoGerado;
    this.loginCodigoLiga = codigoGerado;
    this.loginAdminEmail = this.regEmail.trim();

    alert(`Administrador cadastrado com sucesso!\nO seu código de acesso exclusivo é: ${codigoGerado}`);
  }

  logout(): void {
    this.isLoggedIn = false;
    this.loginNome = '';
    this.loginAdminEmail = '';
    this.loginCodigoLiga = '';
    this.lgpdTermosAceito = false;
    this.generatedCodigoLiga = '';
  }

  getTotalArrecadado(): number {
    return this.cartolaService.players.filter(p => p.mensalidadePaga).length * 50;
  }

  getInadimplenciaCount(): number {
    return this.cartolaService.players.filter(p => !p.mensalidadePaga).length;
  }

  getRankingJogadores(): any[] {
    return this.cartolaService.getPlayersSortedByNota();
  }
}