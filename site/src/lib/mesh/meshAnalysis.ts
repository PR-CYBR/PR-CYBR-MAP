/**
 * Mesh Analysis Module
 * 
 * Provides heuristic analysis for mesh network deployments.
 * Designed to be replaced with real RF propagation and terrain analysis later.
 */

import type {
  MeshNode,
  MeshLink,
  EnvironmentConfig,
  MeshDeploymentAnalysis,
  NodeAnalysis,
  LOSAnalysis,
  LatLon,
  MeshDeviceTemplate
} from './meshTypes';

/**
 * Calculate Haversine distance between two points in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate bearing between two points
 */
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

/**
 * Calculate destination point given distance and bearing
 */
function calculateDestination(
  lat: number,
  lon: number,
  distanceKm: number,
  bearingDeg: number
): LatLon {
  const R = 6371; // Earth's radius in km
  const bearing = toRad(bearingDeg);
  const lat1 = toRad(lat);
  const lon1 = toRad(lon);
  
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceKm / R) +
    Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(bearing)
  );
  
  const lon2 = lon1 + Math.atan2(
    Math.sin(bearing) * Math.sin(distanceKm / R) * Math.cos(lat1),
    Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)
  );
  
  return {
    lat: toDeg(lat2),
    lon: toDeg(lon2)
  };
}

/**
 * Analyze mesh network deployment
 * 
 * This is a heuristic implementation that can be replaced with:
 * - Meshtastic Site Planner for coverage analysis
 * - Meshtastic Simulator for throughput analysis
 * - SPLAT! for terrain-aware RF propagation
 */
export function analyzeDeployment(
  nodes: MeshNode[],
  links: MeshLink[],
  environmentConfig: EnvironmentConfig,
  deviceTemplates: Map<string, MeshDeviceTemplate>
): MeshDeploymentAnalysis {
  const nodeAnalyses: NodeAnalysis[] = [];
  const overRangeLinks: MeshLink[] = [];
  const isolatedNodeIds: string[] = [];
  const overallWarnings: string[] = [];
  const overallSuggestions: string[] = [];
  
  if (nodes.length === 0) {
    return {
      totalNodes: 0,
      activeNodes: 0,
      isolatedNodes: [],
      overRangeLinks: [],
      nodeAnalyses: [],
      overallWarnings: ['No nodes in deployment'],
      overallSuggestions: ['Add at least 2 nodes to create a mesh network']
    };
  }
  
  // Build adjacency map from links
  const adjacency = new Map<string, Set<string>>();
  nodes.forEach(node => adjacency.set(node.id, new Set()));
  
  links.forEach(link => {
    adjacency.get(link.sourceId)?.add(link.targetId);
    adjacency.get(link.targetId)?.add(link.sourceId);
  });
  
  // Analyze each node
  nodes.forEach(node => {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let status: 'ok' | 'isolated' | 'over-range' | 'warning' = 'ok';
    
    const neighbors = adjacency.get(node.id) || new Set();
    const deviceTemplate = deviceTemplates.get(node.deviceType);
    
    // Check for isolation
    if (neighbors.size === 0) {
      status = 'isolated';
      warnings.push('Node is isolated with no connections');
      suggestions.push('Add links to nearby nodes to integrate into mesh');
      isolatedNodeIds.push(node.id);
    } else {
      // Check link distances
      let hasOverRange = false;
      neighbors.forEach(neighborId => {
        const neighbor = nodes.find(n => n.id === neighborId);
        if (neighbor && deviceTemplate) {
          const distance = calculateDistance(
            node.lat,
            node.lon,
            neighbor.lat,
            neighbor.lon
          );
          
          // Environmental factor adjustment
          let adjustedRange = deviceTemplate.maxRangeKm;
          if (environmentConfig.clutterLevel === 'urban') {
            adjustedRange *= 0.5;
          } else if (environmentConfig.clutterLevel === 'suburban') {
            adjustedRange *= 0.7;
          } else if (environmentConfig.clutterLevel === 'open') {
            adjustedRange *= 1.2;
          }
          
          if (distance > adjustedRange) {
            hasOverRange = true;
            warnings.push(
              `Link to ${neighbor.name} is ${distance.toFixed(1)}km, exceeds estimated range of ${adjustedRange.toFixed(1)}km`
            );
            suggestions.push(
              `Consider adding relay node between ${node.name} and ${neighbor.name}`
            );
            
            // Track over-range link
            const linkIndex = links.findIndex(
              l => (l.sourceId === node.id && l.targetId === neighbor.id) ||
                   (l.targetId === node.id && l.sourceId === neighbor.id)
            );
            if (linkIndex >= 0) {
              overRangeLinks.push({
                ...links[linkIndex],
                distanceKm: distance,
                status: 'over-range'
              });
            }
          }
        }
      });
      
      if (hasOverRange) {
        status = status === 'ok' ? 'over-range' : status;
      }
    }
    
    // Suggest role based on degree
    let suggestedRole = node.role;
    if (neighbors.size >= 3) {
      suggestedRole = 'router';
      if (node.role !== 'router' && node.role !== 'gateway') {
        suggestions.push('Consider changing role to router due to multiple connections');
      }
    } else if (neighbors.size === 0) {
      suggestedRole = 'client';
    } else if (neighbors.size <= 2) {
      suggestedRole = node.role === 'gateway' ? 'gateway' : 'client';
    }
    
    // Suggest modem preset based on max link distance
    let maxLinkDistance = 0;
    neighbors.forEach(neighborId => {
      const neighbor = nodes.find(n => n.id === neighborId);
      if (neighbor) {
        const distance = calculateDistance(node.lat, node.lon, neighbor.lat, neighbor.lon);
        maxLinkDistance = Math.max(maxLinkDistance, distance);
      }
    });
    
    let suggestedModemPreset = 'LONG_MODERATE';
    if (maxLinkDistance > 15) {
      suggestedModemPreset = 'LONG_SLOW';
      suggestions.push('Use LONG_SLOW modem preset for extended range');
    } else if (maxLinkDistance < 3) {
      suggestedModemPreset = 'SHORT_FAST';
      suggestions.push('Use SHORT_FAST modem preset for low latency in dense area');
    }
    
    // Power and antenna suggestions
    let suggestedPower = deviceTemplate?.defaultTxPowerDbm || 22;
    let suggestedAntennaGain = deviceTemplate?.defaultAntennaGainDb || 2.15;
    
    if (maxLinkDistance > 10) {
      suggestions.push('Consider higher gain antenna for extended range');
      suggestedAntennaGain = Math.min(suggestedAntennaGain + 3, 9);
    }
    
    nodeAnalyses.push({
      nodeId: node.id,
      status,
      warnings,
      suggestions,
      radioConfig: {
        modemPreset: suggestedModemPreset,
        txPower: suggestedPower,
        antennaGain: suggestedAntennaGain,
        channelName: 'LongFast'
      },
      deviceConfig: {
        role: suggestedRole,
        bluetoothEnabled: suggestedRole !== 'router',
        serialEnabled: true
      },
      moduleConfig: {
        positionEnabled: true,
        telemetryInterval: 900
      }
    });
  });
  
  // Overall warnings and suggestions
  if (isolatedNodeIds.length > 0) {
    overallWarnings.push(`${isolatedNodeIds.length} isolated node(s) detected`);
    overallSuggestions.push('Connect isolated nodes to the mesh network');
  }
  
  if (overRangeLinks.length > 0) {
    overallWarnings.push(`${overRangeLinks.length} link(s) exceed estimated range`);
    overallSuggestions.push('Add relay nodes or move devices closer together');
  }
  
  if (nodes.length < 3) {
    overallSuggestions.push('Add more nodes for redundancy and coverage');
  }
  
  // Estimate coverage (naive circular coverage)
  let totalCoverageKm2 = 0;
  nodes.forEach(node => {
    const deviceTemplate = deviceTemplates.get(node.deviceType);
    if (deviceTemplate) {
      const radius = deviceTemplate.maxRangeKm;
      totalCoverageKm2 += Math.PI * radius * radius;
    }
  });
  
  // Calculate reliability score (0-100)
  const isolationPenalty = (isolatedNodeIds.length / nodes.length) * 40;
  const overRangePenalty = (overRangeLinks.length / Math.max(links.length, 1)) * 30;
  const reliabilityScore = Math.max(0, 100 - isolationPenalty - overRangePenalty);
  
  return {
    totalNodes: nodes.length,
    activeNodes: nodes.length - isolatedNodeIds.length,
    isolatedNodes: isolatedNodeIds,
    overRangeLinks,
    estimatedCoverageKm2: Math.round(totalCoverageKm2),
    reliabilityScore: Math.round(reliabilityScore),
    nodeAnalyses,
    overallWarnings,
    overallSuggestions
  };
}

/**
 * Compute line-of-sight and suggest uplink positions
 * 
 * This is a distance-only heuristic implementation.
 * Can be replaced with terrain-aware LOS using SRTM/SPLAT!
 */
export function computeLosAndUplinks(
  sourceNode: MeshNode,
  targetNode: MeshNode,
  sourceDevice: MeshDeviceTemplate | null,
  targetDevice: MeshDeviceTemplate | null
): LOSAnalysis {
  const distanceKm = calculateDistance(
    sourceNode.lat,
    sourceNode.lon,
    targetNode.lat,
    targetNode.lon
  );
  
  // Determine if LOS is likely based on range
  const minRange = Math.min(
    sourceDevice?.maxRangeKm || 10,
    targetDevice?.maxRangeKm || 10
  );
  
  const losApprox = distanceKm <= minRange;
  const suggestedUplinks: (LatLon & { label: string })[] = [];
  
  // If over range, suggest uplink positions
  if (!losApprox) {
    const bearing = calculateBearing(
      sourceNode.lat,
      sourceNode.lon,
      targetNode.lat,
      targetNode.lon
    );
    
    // Suggest 3 uplink positions along the path
    const positions = [0.25, 0.5, 0.75];
    positions.forEach((fraction, index) => {
      const uplinkDistance = distanceKm * fraction;
      const uplink = calculateDestination(
        sourceNode.lat,
        sourceNode.lon,
        uplinkDistance,
        bearing
      );
      
      suggestedUplinks.push({
        ...uplink,
        label: `UPLINK-${index + 1}`
      });
    });
  }
  
  const terrainWarnings: string[] = [];
  
  if (distanceKm > minRange * 1.5) {
    terrainWarnings.push('Distance significantly exceeds device range');
    terrainWarnings.push('Terrain analysis recommended for accurate planning');
  }
  
  return {
    losApprox,
    distanceKm,
    suggestedUplinks,
    terrainWarnings
  };
}
