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
  imports: [CommonModule, FormsModule, CadastroJogadorComponent, ScoutPartidaComponent, SorteioTimesComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  currentTab: string = 'dashboard';
  isLoggedIn: boolean = false;
  
  loginForm = {
    nome: '',
    email: '',
    senha: '',
    perfil: 'Administrador' as 'Administrador' | 'Associado',
    lgpdAceito: false
  };

  session: { nome: string; email: string; perfil: 'Administrador' | 'Associado' } | null = null;
  jogadores: Player[] = [];

  constructor(public cartolaService: CartolaService) {
    this.cartolaService.players$.forEach(p => this.jogadores = p);
    this.jogadores = this.cartolaService.getPlayers();
  }

  fazerLogin() {
    if (!this.loginForm.lgpdAceito) {
      alert('Você precisa aceitar os Termos de Uso e a Política de Privacidade (LGPD) para acessar o sistema.');
      return;
    }
    if (!this.loginForm.nome || !this.loginForm.email) {
      alert('Por favor, preencha seu nome e e-mail.');
      return;
    }

    this.isLoggedIn = true;
    this.session = {
      nome: this.loginForm.nome,
      email: this.loginForm.email,
      perfil: this.loginForm.perfil
    };
  }

  switchTab(tab: string) {
    this.currentTab = tab;
  }

  getTotalArrecadado(): number {
    return this.jogadores.filter(p => p.statusPagamento === 'Pago').length * 50;
  }

  getInadimplenciaCount(): number {
    return this.jogadores.filter(p => p.statusPagamento === 'Atrasado' || p.statusPagamento === 'Pendente').length;
  }
}