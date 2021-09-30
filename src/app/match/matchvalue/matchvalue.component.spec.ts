import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchvalueComponent } from './matchvalue.component';

describe('MatchvalueComponent', () => {
  let component: MatchvalueComponent;
  let fixture: ComponentFixture<MatchvalueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchvalueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
