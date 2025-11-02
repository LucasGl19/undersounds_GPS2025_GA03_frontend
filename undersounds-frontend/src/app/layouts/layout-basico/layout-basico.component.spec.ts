import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBasicoComponent } from './layout-basico.component';

describe('LayoutBasicoComponent', () => {
  let component: LayoutBasicoComponent;
  let fixture: ComponentFixture<LayoutBasicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutBasicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
