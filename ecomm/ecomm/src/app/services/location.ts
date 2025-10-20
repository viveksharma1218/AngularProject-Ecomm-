import { Injectable,inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherData,WeatherService } from './weather';


export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  weather?: WeatherData;
}
@Injectable({
  providedIn: 'root'
})
export class LocationService {
   private weatherService = inject(WeatherService);

  getCurrentLocation(): Observable<Location> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //console.log(position);
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          observer.next(location);
          observer.complete();
        },
        (error) => {
          observer.error(this.getErrorMessage(error));
        },
        { enableHighAccuracy: true, timeout: 20000 }
      );
    });
  }

  // New method to get location with weather
  getLocationWithWeather(): Observable<Location> {
    return new Observable(observer => {
      this.getCurrentLocation().subscribe({
        next: async (location) => {
          try {
            // Get weather data for the location
            const weatherData = await this.getWeatherData(location.latitude, location.longitude);
            location.weather = weatherData;
            
            // Get address
            location.address = await this.getAddressFromCoords(location.latitude, location.longitude);
            
            observer.next(location);
            observer.complete();
          } catch (error) {
            observer.error('Failed to get weather data');
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  private async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    return new Promise((resolve, reject) => {
      this.weatherService.getCurrentWeather(lat, lon).subscribe({
        next: (data) => {
          const weather = this.weatherService.transformWeatherData(data);
          resolve(weather);
        },
        error: (error) => reject(error)
      });
    });
  }

  private getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please allow location access.';
      case error.POSITION_UNAVAILABLE:
        return 'Your location is currently unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred.';
    }
  }

  async getAddressFromCoords(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      return data.locality || data.city || data.countryName || 'Address not found';
    } catch (error) {
      return 'Address not available';
    }
  }
}
