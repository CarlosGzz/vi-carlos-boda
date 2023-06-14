import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInvitadosComponent } from './lista-invitados.component';

describe('ListaInvitadosComponent', () => {
  let component: ListaInvitadosComponent;
  let fixture: ComponentFixture<ListaInvitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaInvitadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInvitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
