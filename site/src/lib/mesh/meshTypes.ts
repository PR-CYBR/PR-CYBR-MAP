/**
 * Mesh Network Type Definitions
 * 
 * These types define the data structures for M3SH mesh network features.
 */

/**
 * Meshtastic device template with radio specifications
 */
export interface MeshDeviceTemplate {
  id: string;
  label: string;
  description: string;
  manufacturer: string;
  maxRangeKm: number;
  defaultTxPowerDbm: number;
  defaultAntennaGainDb: number;
  defaultModemPreset: string;
  frequency: string;
  batteryCapacityMah: number;
  features: string[];
}

/**
 * Location information for a mesh node
 */
export interface LatLon {
  lat: number;
  lon: number;
}

/**
 * Individual mesh node in a network
 */
export interface MeshNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  altitude?: number;
  deviceType: string;
  role: 'router' | 'client' | 'gateway' | 'relay';
  status?: 'active' | 'inactive' | 'maintenance';
  owner?: string;
  // Client-side deployment fields
  warnings?: string[];
  suggestedRole?: string;
  suggestedModemPreset?: string;
  suggestedPowerDbm?: number;
  suggestedAntennaGainDb?: number;
}

/**
 * Link between two mesh nodes
 */
export interface MeshLink {
  sourceId: string;
  targetId: string;
  distanceKm?: number;
  status?: 'ok' | 'over-range' | 'warning';
}

/**
 * Environment configuration for deployment analysis
 */
export interface EnvironmentConfig {
  clutterLevel?: 'urban' | 'suburban' | 'rural' | 'open';
  environmentType?: 'coastal' | 'mountain' | 'forest' | 'urban';
  targetReliability?: number; // 0-100 percentage
  weatherConditions?: 'clear' | 'rain' | 'storm';
}

/**
 * Per-node analysis result
 */
export interface NodeAnalysis {
  nodeId: string;
  status: 'ok' | 'isolated' | 'over-range' | 'warning';
  warnings: string[];
  suggestions: string[];
  // Radio config suggestions (matching Meshtastic app structure)
  radioConfig?: {
    modemPreset?: string;
    txPower?: number;
    antennaGain?: number;
    channelName?: string;
  };
  deviceConfig?: {
    role?: string;
    bluetoothEnabled?: boolean;
    serialEnabled?: boolean;
  };
  moduleConfig?: {
    positionEnabled?: boolean;
    telemetryInterval?: number;
  };
}

/**
 * Overall deployment analysis result
 */
export interface MeshDeploymentAnalysis {
  totalNodes: number;
  activeNodes: number;
  isolatedNodes: string[];
  overRangeLinks: MeshLink[];
  estimatedCoverageKm2?: number;
  reliabilityScore?: number; // 0-100
  nodeAnalyses: NodeAnalysis[];
  overallWarnings: string[];
  overallSuggestions: string[];
}

/**
 * Complete mesh network definition
 */
export interface MeshNetwork {
  id: string;
  name: string;
  description: string;
  prDiv: string;
  totalNodes: number;
  activeNodes: number;
  status: 'active' | 'inactive' | 'planning';
  established?: string;
  primaryUse?: string;
  profileUrl?: string | null;
  contact?: {
    discord?: string | null;
    email?: string | null;
  };
  nodes: MeshNode[];
  coverage?: {
    estimatedRangeKm: number;
    reliabilityPercent: number;
  };
  profile?: MeshNetworkProfile;
}

/**
 * Extended profile information for a mesh network
 */
export interface MeshNetworkProfile {
  logoUrl?: string | null;
  links?: {
    github?: string | null;
    docs?: string | null;
    discord?: string | null;
    telegram?: string | null;
  };
  operatingRegion?: string;
  configSummary?: {
    defaultModemPreset?: string;
    channelName?: string;
    encryptionEnabled?: boolean;
    hopLimit?: number;
  };
}

/**
 * Line-of-sight analysis result
 */
export interface LOSAnalysis {
  losApprox: boolean;
  distanceKm: number;
  suggestedUplinks: (LatLon & { label: string })[];
  terrainWarnings?: string[];
}

/**
 * Store state for mesh deployment builder
 */
export interface MeshDeploymentStore {
  nodes: MeshNode[];
  links: MeshLink[];
  environmentConfig: EnvironmentConfig;
  analysis: MeshDeploymentAnalysis | null;
}

/**
 * Device list wrapper
 */
export interface DeviceList {
  devices: MeshDeviceTemplate[];
}

/**
 * Network list wrapper
 */
export interface NetworkList {
  networks: MeshNetwork[];
  schema_version: string;
  last_updated: string;
}
