import { Routes } from '@angular/router';
import { CadastroJogadorComponent } from './components/cadastro-jogador/cadastro-jogador';
import { SorteioTimesComponent } from './components/sorteio-times/sorteio-times';
import { ScoutPartidaComponent } from './components/scout-partida/scout-partida';

export const routes: Routes = [
  { path: '', redirectTo: 'cadastro-jogador', pathMatch: 'full' },
  { path: 'cadastro-jogador', component: CadastroJogadorComponent },
  { path: 'sorteio-times', component: SorteioTimesComponent },
  { path: 'scout-partida', component: ScoutPartidaComponent }
];