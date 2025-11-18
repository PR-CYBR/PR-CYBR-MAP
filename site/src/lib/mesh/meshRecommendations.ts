/**
 * Mesh Recommendations Module
 * 
 * Provides device and configuration recommendations for mesh nodes.
 */

import type { MeshNode, MeshDeviceTemplate } from './meshTypes';

/**
 * Get recommended device for a specific use case
 */
export function getRecommendedDevice(
  useCase: 'portable' | 'vehicle' | 'fixed' | 'low-power' | 'high-power',
  devices: MeshDeviceTemplate[]
): MeshDeviceTemplate | null {
  const recommendations: Record<string, string[]> = {
    portable: ['trekker-mini', 'lilygo-t-beam', 'lilygo-t-echo', 'heltec-v3'],
    vehicle: ['trekker-copilot', 'trekker-bravo', 'wisblock'],
    fixed: ['custom-router', 'morosx-manet', 'wisblock'],
    'low-power': ['lilygo-t-echo', 'rak4631', 'heltec-v3'],
    'high-power': ['morosx-manet', 'custom-router', 'trekker-copilot']
  };
  
  const recommendedIds = recommendations[useCase] || [];
  
  for (const id of recommendedIds) {
    const device = devices.find(d => d.id === id);
    if (device) {
      return device;
    }
  }
  
  return devices[0] || null;
}

/**
 * Get device configuration recommendations based on role and environment
 */
export function getDeviceConfigRecommendations(
  node: MeshNode,
  device: MeshDeviceTemplate | null,
  environment: 'urban' | 'suburban' | 'rural' | 'open' = 'suburban'
): Record<string, any> {
  if (!device) {
    return {};
  }
  
  const config: Record<string, any> = {
    // LoRa Radio Configuration
    loRa: {
      region: 'US',
      hopLimit: node.role === 'router' || node.role === 'gateway' ? 5 : 3,
      txEnabled: true,
      txPower: device.defaultTxPowerDbm,
      channelNum: 0,
      modemPreset: device.defaultModemPreset,
      bandwidth: device.defaultModemPreset === 'LONG_SLOW' ? 125 : 250,
      spreadFactor: device.defaultModemPreset === 'LONG_SLOW' ? 11 : 9,
      codingRate: 8
    },
    
    // Channels Configuration
    channels: {
      primary: {
        name: 'LongFast',
        psk: 'AQ==', // Default key
        role: 'PRIMARY'
      }
    },
    
    // Device Configuration
    device: {
      role: node.role.toUpperCase(),
      serialEnabled: true,
      debugLogEnabled: false,
      rebroadcastMode: node.role === 'router' ? 'ALL' : 'LOCAL_ONLY',
      nodeInfoBroadcastSecs: 900,
      positionBroadcastSecs: 900
    },
    
    // Bluetooth Configuration
    bluetooth: {
      enabled: node.role !== 'router',
      mode: 'RANDOM_PIN',
      fixedPin: 123456
    },
    
    // Network Configuration
    network: {
      wifiEnabled: device.features.includes('WiFi'),
      wifiSsid: `meshtastic-${node.id.substring(0, 6)}`,
      ethEnabled: false
    },
    
    // Position Configuration
    position: {
      gpsEnabled: device.features.includes('GPS'),
      gpsUpdateInterval: 120,
      positionFlags: ['ALTITUDE', 'HEADING', 'SPEED'],
      broadcastSmartEnabled: true
    },
    
    // Power Configuration
    power: {
      isPowerSaving: environment === 'rural' || node.role === 'client',
      lsSecs: 300,
      minWakeSecs: 10,
      deviceBatteryInaMilliamps: device.batteryCapacityMah
    },
    
    // Module Configuration - Telemetry
    telemetry: {
      deviceUpdateInterval: 900,
      environmentUpdateInterval: 900,
      environmentScreenEnabled: true,
      environmentDisplayFahrenheit: false
    },
    
    // Module Configuration - MQTT
    mqtt: {
      enabled: node.role === 'gateway',
      address: node.role === 'gateway' ? 'mqtt.meshtastic.org' : '',
      username: '',
      password: '',
      encryptionEnabled: true
    },
    
    // Module Configuration - Range Test
    rangeTest: {
      enabled: false,
      sender: 0,
      save: false
    },
    
    // Module Configuration - Store & Forward
    storeForward: {
      enabled: node.role === 'router',
      heartbeat: false,
      records: 100,
      historyReturnMax: 25,
      historyReturnWindow: 240
    }
  };
  
  // Adjust for environment
  if (environment === 'urban') {
    config.loRa.modemPreset = 'SHORT_FAST';
    config.loRa.txPower = Math.min(config.loRa.txPower, 20);
  } else if (environment === 'open') {
    config.loRa.modemPreset = 'LONG_SLOW';
    config.loRa.txPower = Math.max(config.loRa.txPower, 22);
  }
  
  return config;
}

/**
 * Get antenna recommendations based on deployment scenario
 */
export function getAntennaRecommendations(
  maxLinkDistanceKm: number,
  mountType: 'handheld' | 'vehicle' | 'fixed' = 'handheld'
): { type: string; gainDb: number; notes: string }[] {
  const recommendations: { type: string; gainDb: number; notes: string }[] = [];
  
  if (maxLinkDistanceKm < 5) {
    recommendations.push({
      type: 'Stock Antenna',
      gainDb: 2.15,
      notes: 'Sufficient for short-range urban deployment'
    });
  }
  
  if (maxLinkDistanceKm >= 5 && maxLinkDistanceKm < 15) {
    recommendations.push({
      type: '5.8 dBi Outdoor Antenna',
      gainDb: 5.8,
      notes: 'Good balance for suburban/rural areas'
    });
  }
  
  if (maxLinkDistanceKm >= 15 || mountType === 'fixed') {
    recommendations.push({
      type: '9 dBi High Gain Antenna',
      gainDb: 9.0,
      notes: 'Best for long-range fixed installations'
    });
  }
  
  if (mountType === 'vehicle') {
    recommendations.push({
      type: 'Mag Mount 5 dBi',
      gainDb: 5.0,
      notes: 'Easy vehicle mounting with good range'
    });
  }
  
  return recommendations;
}

/**
 * Get power configuration recommendations
 */
export function getPowerRecommendations(
  device: MeshDeviceTemplate | null,
  role: string,
  solarAvailable: boolean
): { mode: string; notes: string } {
  if (!device) {
    return { mode: 'NORMAL', notes: 'No device specified' };
  }
  
  if (role === 'router' && solarAvailable) {
    return {
      mode: 'ALWAYS_ON',
      notes: 'Router with solar can stay always on for network reliability'
    };
  }
  
  if (role === 'router') {
    return {
      mode: 'POWER_SAVING_LIGHT',
      notes: 'Light power saving to maintain network availability'
    };
  }
  
  if (device.batteryCapacityMah < 2000) {
    return {
      mode: 'POWER_SAVING_AGGRESSIVE',
      notes: 'Small battery requires aggressive power saving'
    };
  }
  
  return {
    mode: 'POWER_SAVING',
    notes: 'Standard power saving for portable use'
  };
}

/**
 * Get security recommendations
 */
export function getSecurityRecommendations(
  networkType: 'public' | 'private' | 'emergency'
): { encryption: string; psk: string; notes: string } {
  if (networkType === 'public') {
    return {
      encryption: 'NONE',
      psk: 'AQ==',
      notes: 'Public network, default key for compatibility'
    };
  }
  
  if (networkType === 'emergency') {
    return {
      encryption: 'AES256',
      psk: 'CUSTOM_KEY_REQUIRED',
      notes: 'Emergency network should use shared known key'
    };
  }
  
  // Private network
  return {
    encryption: 'AES256',
    psk: 'GENERATE_RANDOM',
    notes: 'Private network requires unique encryption key'
  };
}
