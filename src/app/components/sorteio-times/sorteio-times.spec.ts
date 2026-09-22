import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SorteioTimesComponent } from './sorteio-times';

describe('SorteioTimesComponent', () => {
  let component: SorteioTimesComponent;
  let fixture: ComponentFixture<SorteioTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SorteioTimesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SorteioTimesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});