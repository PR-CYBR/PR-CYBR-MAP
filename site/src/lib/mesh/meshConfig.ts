/**
 * Mesh Configuration Helper Functions
 * 
 * Utilities to load mesh device templates and network data.
 * Designed to work both in Astro server context and browser.
 */

import type { DeviceList, NetworkList, MeshDeviceTemplate, MeshNetwork } from './meshTypes';

/**
 * Load device templates from devices.json
 * Falls back to empty list if file doesn't exist or fails to load
 */
export async function loadDeviceTemplates(): Promise<MeshDeviceTemplate[]> {
  try {
    // Try multiple possible paths
    const paths = [
      '/PR-CYBR-MAP/data/mesh/devices.json',
      '/data/mesh/devices.json',
      '../../data/mesh/devices.json'
    ];
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data: DeviceList = await response.json();
          return data.devices || [];
        }
      } catch (err) {
        // Try next path
        continue;
      }
    }
    
    console.warn('Could not load device templates, using empty list');
    return [];
  } catch (error) {
    console.error('Error loading device templates:', error);
    return [];
  }
}

/**
 * Load mesh networks from mesh_networks.json
 * Falls back to example file if real data doesn't exist
 */
export async function loadMeshNetworks(): Promise<MeshNetwork[]> {
  try {
    // Try real data first, then example
    const paths = [
      '/PR-CYBR-MAP/data/mesh/mesh_networks.json',
      '/PR-CYBR-MAP/data/mesh/mesh_networks.example.json',
      '/data/mesh/mesh_networks.json',
      '/data/mesh/mesh_networks.example.json',
      '../../data/mesh/mesh_networks.json',
      '../../data/mesh/mesh_networks.example.json'
    ];
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data: NetworkList = await response.json();
          return data.networks || [];
        }
      } catch (err) {
        // Try next path
        continue;
      }
    }
    
    console.warn('Could not load mesh networks, using empty list');
    return [];
  } catch (error) {
    console.error('Error loading mesh networks:', error);
    return [];
  }
}

/**
 * Get a specific device template by ID
 */
export async function getDeviceTemplate(deviceId: string): Promise<MeshDeviceTemplate | null> {
  const devices = await loadDeviceTemplates();
  return devices.find(d => d.id === deviceId) || null;
}

/**
 * Get a specific mesh network by ID
 */
export async function getMeshNetwork(networkId: string): Promise<MeshNetwork | null> {
  const networks = await loadMeshNetworks();
  return networks.find(n => n.id === networkId) || null;
}

/**
 * Filter networks by PR division
 */
export function filterNetworksByDivision(networks: MeshNetwork[], prDiv: string): MeshNetwork[] {
  if (!prDiv || prDiv === 'all') {
    return networks;
  }
  return networks.filter(n => n.prDiv === prDiv);
}

/**
 * Search networks by text (name or description)
 */
export function searchNetworks(networks: MeshNetwork[], searchText: string): MeshNetwork[] {
  if (!searchText) {
    return networks;
  }
  
  const lowerSearch = searchText.toLowerCase();
  return networks.filter(n => 
    n.name.toLowerCase().includes(lowerSearch) ||
    n.description.toLowerCase().includes(lowerSearch) ||
    n.prDiv.toLowerCase().includes(lowerSearch)
  );
}

/**
 * Get unique PR divisions from network list
 */
export function getUniqueDivisions(networks: MeshNetwork[]): string[] {
  const divisions = networks.map(n => n.prDiv).filter(Boolean);
  return Array.from(new Set(divisions)).sort();
}
