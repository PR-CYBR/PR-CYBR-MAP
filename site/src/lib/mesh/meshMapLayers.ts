/**
 * Mesh Map Layers Module
 * 
 * Leaflet integration for M3SH mesh network visualization.
 * Provides layer groups and utilities for nodes, links, and uplinks.
 */

import type { MeshNode, MeshLink, LatLon } from './meshTypes';

// Type definitions for Leaflet (minimal, to avoid full import)
interface LeafletMap {
  addLayer(layer: any): void;
  removeLayer(layer: any): void;
}

interface LeafletLayerGroup {
  addTo(map: LeafletMap): void;
  removeFrom(map: LeafletMap): void;
  clearLayers(): void;
  addLayer(layer: any): void;
  removeLayer(layer: any): void;
}

/**
 * Mesh map controller for managing mesh visualization layers
 */
export class MeshMapLayers {
  private map: any; // Leaflet map instance
  private L: any; // Leaflet library
  private meshNodesLayer: any;
  private meshLinksLayer: any;
  private meshUplinkLayer: any;
  private nodeMarkers: Map<string, any>;
  
  constructor(map: any, L: any) {
    this.map = map;
    this.L = L;
    this.nodeMarkers = new Map();
    
    // Create layer groups
    this.meshNodesLayer = L.layerGroup();
    this.meshLinksLayer = L.layerGroup();
    this.meshUplinkLayer = L.layerGroup();
    
    // Add layers to map initially (can be toggled later)
    this.meshLinksLayer.addTo(map); // Links below nodes
    this.meshNodesLayer.addTo(map);
    this.meshUplinkLayer.addTo(map);
  }
  
  /**
   * Get the nodes layer group
   */
  getNodesLayer(): any {
    return this.meshNodesLayer;
  }
  
  /**
   * Get the links layer group
   */
  getLinksLayer(): any {
    return this.meshLinksLayer;
  }
  
  /**
   * Get the uplink layer group
   */
  getUplinkLayer(): any {
    return this.meshUplinkLayer;
  }
  
  /**
   * Add a mesh node to the map
   */
  addMeshNode(
    node: MeshNode,
    onClick?: (node: MeshNode) => void,
    onRightClick?: (node: MeshNode) => void
  ): void {
    // Choose icon color based on role
    const iconColor = this.getNodeColor(node.role);
    const iconSize = node.role === 'gateway' || node.role === 'router' ? 14 : 10;
    
    // Create custom icon
    const icon = this.L.divIcon({
      className: 'mesh-node-marker',
      html: `<div style="
        background-color: ${iconColor};
        width: ${iconSize}px;
        height: ${iconSize}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>`,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2]
    });
    
    // Create marker
    const marker = this.L.marker([node.lat, node.lon], { icon })
      .bindTooltip(node.name || node.id, {
        permanent: false,
        direction: 'top'
      });
    
    // Bind events
    if (onClick) {
      marker.on('click', () => onClick(node));
    }
    
    if (onRightClick) {
      marker.on('contextmenu', () => onRightClick(node));
    }
    
    // Add to layer and store reference
    marker.addTo(this.meshNodesLayer);
    this.nodeMarkers.set(node.id, marker);
  }
  
  /**
   * Update an existing mesh node
   */
  updateMeshNode(node: MeshNode): void {
    const existingMarker = this.nodeMarkers.get(node.id);
    if (existingMarker) {
      // Update position
      existingMarker.setLatLng([node.lat, node.lon]);
      
      // Update tooltip
      existingMarker.setTooltipContent(node.name || node.id);
      
      // Update icon if role changed
      const iconColor = this.getNodeColor(node.role);
      const iconSize = node.role === 'gateway' || node.role === 'router' ? 14 : 10;
      
      const icon = this.L.divIcon({
        className: 'mesh-node-marker',
        html: `<div style="
          background-color: ${iconColor};
          width: ${iconSize}px;
          height: ${iconSize}px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.5);
        "></div>`,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2]
      });
      
      existingMarker.setIcon(icon);
    }
  }
  
  /**
   * Remove a mesh node from the map
   */
  removeMeshNode(nodeId: string): void {
    const marker = this.nodeMarkers.get(nodeId);
    if (marker) {
      this.meshNodesLayer.removeLayer(marker);
      this.nodeMarkers.delete(nodeId);
    }
  }
  
  /**
   * Clear all mesh nodes
   */
  clearMeshNodes(): void {
    this.meshNodesLayer.clearLayers();
    this.nodeMarkers.clear();
  }
  
  /**
   * Set mesh links (replaces all existing links)
   */
  setMeshLinks(links: MeshLink[], nodes: MeshNode[]): void {
    this.meshLinksLayer.clearLayers();
    
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    links.forEach(link => {
      const sourceNode = nodeMap.get(link.sourceId);
      const targetNode = nodeMap.get(link.targetId);
      
      if (sourceNode && targetNode) {
        const color = this.getLinkColor(link.status);
        const weight = link.status === 'over-range' ? 3 : 2;
        
        const polyline = this.L.polyline(
          [
            [sourceNode.lat, sourceNode.lon],
            [targetNode.lat, targetNode.lon]
          ],
          {
            color,
            weight,
            opacity: 0.6,
            dashArray: link.status === 'over-range' ? '5, 10' : undefined
          }
        );
        
        // Add tooltip showing distance if available
        if (link.distanceKm) {
          polyline.bindTooltip(
            `${link.distanceKm.toFixed(1)} km`,
            { sticky: true }
          );
        }
        
        polyline.addTo(this.meshLinksLayer);
      }
    });
  }
  
  /**
   * Clear all mesh links
   */
  clearMeshLinks(): void {
    this.meshLinksLayer.clearLayers();
  }
  
  /**
   * Add uplink markers
   */
  addUplinkMarkers(uplinks: (LatLon & { label: string })[]): void {
    this.meshUplinkLayer.clearLayers();
    
    uplinks.forEach(uplink => {
      const icon = this.L.divIcon({
        className: 'mesh-uplink-marker',
        html: `<div style="
          background-color: #ffaa00;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 6px rgba(255,170,0,0.8);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      
      const marker = this.L.marker([uplink.lat, uplink.lon], { icon })
        .bindTooltip(uplink.label, {
          permanent: true,
          direction: 'top',
          className: 'mesh-uplink-label'
        });
      
      marker.addTo(this.meshUplinkLayer);
    });
  }
  
  /**
   * Clear uplink markers
   */
  clearUplinkMarkers(): void {
    this.meshUplinkLayer.clearLayers();
  }
  
  /**
   * Show/hide mesh layers
   */
  toggleMeshLayers(visible: boolean): void {
    if (visible) {
      this.meshLinksLayer.addTo(this.map);
      this.meshNodesLayer.addTo(this.map);
      this.meshUplinkLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.meshLinksLayer);
      this.map.removeLayer(this.meshNodesLayer);
      this.map.removeLayer(this.meshUplinkLayer);
    }
  }
  
  /**
   * Highlight a specific node
   */
  highlightNode(nodeId: string): void {
    const marker = this.nodeMarkers.get(nodeId);
    if (marker) {
      marker.openTooltip();
      // Could also add pulsing animation or color change
    }
  }
  
  /**
   * Clear all mesh visualization
   */
  clearAll(): void {
    this.clearMeshNodes();
    this.clearMeshLinks();
    this.clearUplinkMarkers();
  }
  
  /**
   * Get color for node based on role
   */
  private getNodeColor(role: string): string {
    switch (role) {
      case 'gateway':
        return '#10b981'; // Green
      case 'router':
        return '#3b82f6'; // Blue
      case 'relay':
        return '#f59e0b'; // Amber
      case 'client':
      default:
        return '#6366f1'; // Indigo
    }
  }
  
  /**
   * Get color for link based on status
   */
  private getLinkColor(status?: string): string {
    switch (status) {
      case 'over-range':
        return '#ef4444'; // Red
      case 'warning':
        return '#f59e0b'; // Amber
      case 'ok':
      default:
        return '#10b981'; // Green
    }
  }
}

/**
 * Create and initialize mesh map layers
 */
export function createMeshMapLayers(map: any, L: any): MeshMapLayers {
  return new MeshMapLayers(map, L);
}
