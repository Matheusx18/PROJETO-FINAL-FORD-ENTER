import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroJogador } from './cadastro-jogador';

describe('CadastroJogador', () => {
  let component: CadastroJogador;
  let fixture: ComponentFixture<CadastroJogador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroJogador],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroJogador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
