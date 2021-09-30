import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeGameDetailsFunction = new EventEmitter();
  subsVar: Subscription | undefined;
  constructor() { }

  getLimitInGameDetails() {
    this.invokeGameDetailsFunction.emit();
  }
}