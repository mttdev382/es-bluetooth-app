import { Injectable } from '@angular/core';
import { filter, map, mergeMap } from 'rxjs/operators';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatteryLevelService {
  static GATT_CHARACTERISTIC_BATTERY_LEVEL = 'battery_level';
  static GATT_PRIMARY_SERVICE = 'battery_service';

  constructor(public ble: BluetoothCore) { }

  getDevice() {
    // call this method to get the connected device
    return this.ble.getDevice$();
  }

  stream() {
    // call this method to get a stream of values emitted by the device
    return this.ble.streamValues$().pipe(map((value: DataView) => value.getUint8(0)));
  }

  disconnectDevice() {
    this.ble.disconnectDevice();
  }

  /**
   * Get Battery Level GATT Characteristic value.
   * This logic is specific to this service, this is why we can't abstract it elsewhere.
   * The developer is free to provide any service, and characteristics they want.
   *
   * @return Emites the value of the requested service read from the device
   */
  value() {
    console.log('Getting Battery level...');

    return this.ble

      // 1) call the discover method will trigger the discovery process (by the browser)
      .discover$({
        acceptAllDevices: true,
        optionalServices: [BatteryLevelService.GATT_PRIMARY_SERVICE]
      })
      .pipe(

        mergeMap((gatt: BluetoothRemoteGATTServer | null | void) => {
          if (!gatt) {
            // Gestisci il caso in cui gatt sia null o void
            return throwError("Gatt server non disponibile");
          }
          return this.ble.getPrimaryService$(gatt, BatteryLevelService.GATT_PRIMARY_SERVICE);
        }),

        mergeMap((primaryService: BluetoothRemoteGATTService) => {
          return this.ble.getCharacteristic$(primaryService, BatteryLevelService.GATT_CHARACTERISTIC_BATTERY_LEVEL).pipe(
            map((characteristic: BluetoothRemoteGATTCharacteristic | null) => {
              if (characteristic === null) {
                // Gestisci il caso in cui il caratteristica sia null
                throw new Error("La caratteristica non è disponibile");
              }
              return characteristic;
            })
          );
        }),

        mergeMap((characteristic: BluetoothRemoteGATTCharacteristic) => {
          return this.ble.readValue$(characteristic);
        }),
        map((value: DataView) => value.getUint8(0))
      )
  }
}