import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistStatsComponent } from './artist-stats.component';

describe('ArtistStatsComponent', () => {
  let component: ArtistStatsComponent;
  let fixture: ComponentFixture<ArtistStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
