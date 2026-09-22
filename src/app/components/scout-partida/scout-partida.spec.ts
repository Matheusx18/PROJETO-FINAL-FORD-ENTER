import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoutPartidaComponent } from './scout-partida';

describe('ScoutPartidaComponent', () => {
  let component: ScoutPartidaComponent;
  let fixture: ComponentFixture<ScoutPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutPartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutPartidaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});