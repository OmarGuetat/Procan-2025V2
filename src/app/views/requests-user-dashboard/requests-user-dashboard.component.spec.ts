import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsUserDashboardComponent } from './requests-user-dashboard.component';

describe('RequestsUserDashboardComponent', () => {
  let component: RequestsUserDashboardComponent;
  let fixture: ComponentFixture<RequestsUserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsUserDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
