import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewLiquidaManagerPage } from './new-liquida-manager.page';

describe('NewLiquidaManagerPage', () => {
  let component: NewLiquidaManagerPage;
  let fixture: ComponentFixture<NewLiquidaManagerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLiquidaManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
