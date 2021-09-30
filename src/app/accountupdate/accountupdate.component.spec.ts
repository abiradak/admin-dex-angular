import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountupdateComponent } from './accountupdate.component';

describe('AccountupdateComponent', () => {
  let component: AccountupdateComponent;
  let fixture: ComponentFixture<AccountupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountupdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
