import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { ClimaActual, ClimaService, Pais } from '../services/clima.service';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSpinner,
    CommonModule,
    FormsModule,
  ],
})
export class ClimaPage implements OnInit {
  paises: Pais[] = [
    { nombre: 'Honduras', capital: 'Tegucigalpa', latitud: 14.0723, longitud: -87.1921 },
    { nombre: 'Guatemala', capital: 'Ciudad de Guatemala', latitud: 14.6284, longitud: -90.5221 },
    { nombre: 'El Salvador', capital: 'San Salvador', latitud: 13.6929, longitud: -89.2182 },
    { nombre: 'Nicaragua', capital: 'Managua', latitud: 12.1364, longitud: -86.2514 },
    { nombre: 'Costa Rica', capital: 'San José', latitud: 9.9281, longitud: -84.0907 },
    { nombre: 'México', capital: 'Ciudad de México', latitud: 19.4326, longitud: -99.1332 },
  ];

  paisSeleccionado: Pais | null = null;
  clima: ClimaActual | null = null;
  cargando = false;

  constructor(private climaService: ClimaService) {}

  ngOnInit(): void {
    this.paisSeleccionado = this.paises[0];
    this.consultarClima();
  }

  consultarClima(): void {
    if (!this.paisSeleccionado) {
      return;
    }

    this.cargando = true;
    this.clima = null;

    this.climaService.obtenerClima(this.paisSeleccionado).subscribe({
      next: (respuesta) => {
        this.clima = respuesta;
        this.cargando = false;
      },
      error: () => {
        this.clima = null;
        this.cargando = false;
      },
    });
  }
}
