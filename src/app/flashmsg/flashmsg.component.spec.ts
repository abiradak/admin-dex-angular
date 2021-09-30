import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashmsgComponent } from './flashmsg.component';

describe('FlashmsgComponent', () => {
  let component: FlashmsgComponent;
  let fixture: ComponentFixture<FlashmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlashmsgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
