import { Component, OnInit } from '@angular/core';
import { BatteryLevelService } from '../../services/battery-level.service';

@Component({
  selector: 'battery-level',
  templateUrl: './battery-level.component.html',
  styleUrl: './battery-level.component.scss',
})
export class BatteryLevelComponent implements OnInit {
  devices: BluetoothDevice[] = [];
  isBluetoothSupported: boolean = false;
  batteryLevel: any;

  ngOnInit(): void {
    if ('bluetooth' in navigator) {
      this.isBluetoothSupported = true;
    } else {
      console.log('Web Bluetooth API is not supported.');
      return;
    }
  }

  requestBluetoothDevices(): void {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
      })
      .then((device) => {
        console.log('Bluetooth device found:', device);
        this.devices.push(device);
        return device.gatt?.connect();
      })
      .then((server) => server?.getPrimaryService('battery_service'))
      .then((service) => service?.getCharacteristic('battery_level'))
      .then((characteristic) => characteristic?.readValue())
      .then((value) => {
        const batteryLevel = value?.getUint8(0);
        console.log('Battery level:', batteryLevel);
        this.batteryLevel = batteryLevel;
      })
      .catch((error) => {
        console.error(
          'Failed to find Bluetooth device or read battery level:',
          error
        );
      });
  }
}
