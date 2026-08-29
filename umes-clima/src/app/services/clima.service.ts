import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Pais {
  nombre: string;
  capital: string;
  latitud: number;
  longitud: number;
}

export interface RespuestaOpenMeteo {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

export interface ClimaActual {
  pais: string;
  capital: string;
  condicion: string;
  temperatura: number;
  sensacionTermica: number;
  humedad: number;
  velocidadViento: number;
  fechaHora: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';

  obtenerClima(pais: Pais): Observable<ClimaActual> {
    const params = new HttpParams()
      .set('latitude', pais.latitud.toString())
      .set('longitude', pais.longitud.toString())
      .set(
        'current',
        [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'wind_speed_10m',
          'weather_code',
        ].join(',')
      )
      .set('timezone', 'auto');

    return this.http.get<RespuestaOpenMeteo>(this.apiUrl, { params }).pipe(
      map((respuesta) => ({
        pais: pais.nombre,
        capital: pais.capital,
        condicion: this.obtenerCondicion(respuesta.current.weather_code),
        temperatura: respuesta.current.temperature_2m,
        sensacionTermica: respuesta.current.apparent_temperature,
        humedad: respuesta.current.relative_humidity_2m,
        velocidadViento: respuesta.current.wind_speed_10m,
        fechaHora: respuesta.current.time,
      }))
    );
  }

  private obtenerCondicion(code: number): string {
    const condiciones: Record<number, string> = {
      0: 'Despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      56: 'Llovizna helada',
      57: 'Llovizna helada intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      66: 'Lluvia helada',
      67: 'Lluvia helada intensa',
      71: 'Nieve ligera',
      73: 'Nieve moderada',
      75: 'Nieve intensa',
      77: 'Granizo',
      80: 'Lluvias leves',
      81: 'Lluvias moderadas',
      82: 'Lluvias fuertes',
      85: 'Nevadas ligeras',
      86: 'Nevadas intensas',
      95: 'Tormenta',
      96: 'Tormenta con granizo',
      99: 'Tormenta severa con granizo',
    };

    return condiciones[code] ?? 'Condición no disponible';
  }
}