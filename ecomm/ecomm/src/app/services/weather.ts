import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  feelsLike: number;
  pressure: number;
}


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  
  // Replace with your actual API key
  private apiKey = 'fe9c3bfd56bf8a7a3316d43f71814415';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  getCurrentWeather(lat: number, lon: number): Observable<any> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

  getWeatherForecast(lat: number, lon: number): Observable<any> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

  // Transform the API response to our WeatherData interface
  transformWeatherData(apiData: any): WeatherData {
    return {
      temperature: Math.round(apiData.main.temp),
      description: apiData.weather[0].description,
      icon: apiData.weather[0].icon,
      humidity: apiData.main.humidity,
      windSpeed: apiData.wind.speed,
      city: apiData.name,
      country: apiData.sys.country,
      feelsLike: Math.round(apiData.main.feels_like),
      pressure: apiData.main.pressure
    };
  }
}
