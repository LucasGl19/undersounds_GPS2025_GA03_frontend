import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCreationsComponent } from './modify-creations.component';

describe('ModifyCreationsComponent', () => {
  let component: ModifyCreationsComponent;
  let fixture: ComponentFixture<ModifyCreationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyCreationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyCreationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
