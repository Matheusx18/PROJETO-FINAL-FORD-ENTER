import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroJogadorComponent } from './cadastro-jogador';

describe('CadastroJogadorComponent', () => {
  let component: CadastroJogadorComponent;
  let fixture: ComponentFixture<CadastroJogadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroJogadorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroJogadorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});