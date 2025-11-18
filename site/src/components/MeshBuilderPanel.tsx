/**
 * Mesh Builder Panel Component
 * 
 * UI for M3SH-BLDR virtual mesh network builder.
 */

import { useState, useEffect } from 'react';
import type {
  MeshNode,
  MeshLink,
  MeshDeviceTemplate,
  EnvironmentConfig,
  MeshDeploymentAnalysis,
  NodeAnalysis
} from '../lib/mesh/meshTypes';
import { loadDeviceTemplates } from '../lib/mesh/meshConfig';
import { analyzeDeployment, computeLosAndUplinks } from '../lib/mesh/meshAnalysis';
import type { MeshMapLayers } from '../lib/mesh/meshMapLayers';

interface MeshBuilderPanelProps {
  meshLayers: MeshMapLayers | null;
  onClose?: () => void;
}

export default function MeshBuilderPanel({ meshLayers, onClose }: MeshBuilderPanelProps) {
  const [devices, setDevices] = useState<MeshDeviceTemplate[]>([]);
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  const [links, setLinks] = useState<MeshLink[]>([]);
  const [analysis, setAnalysis] = useState<MeshDeploymentAnalysis | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('trekker-bravo');
  const [linkMode, setLinkMode] = useState(false);
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null);
  const [selectedNodeForLOS, setSelectedNodeForLOS] = useState<{ source: string | null; target: string | null }>({
    source: null,
    target: null
  });
  const [environmentConfig, setEnvironmentConfig] = useState<EnvironmentConfig>({
    clutterLevel: 'suburban',
    environmentType: 'urban',
    targetReliability: 85
  });
  const [editingNode, setEditingNode] = useState<MeshNode | null>(null);
  
  // Load device templates on mount
  useEffect(() => {
    loadDeviceTemplates().then(setDevices);
  }, []);
  
  // Handle map clicks for node placement
  useEffect(() => {
    if (!meshLayers) return;
    
    const handleMapClick = (e: any) => {
      if (linkMode) {
        // Link mode handled by node clicks
        return;
      }
      
      // Add new node at click location
      const newNode: MeshNode = {
        id: `node-${Date.now()}`,
        name: `Node ${nodes.length + 1}`,
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        altitude: 10,
        deviceType: selectedDevice,
        role: 'client',
        status: 'active'
      };
      
      setNodes(prev => [...prev, newNode]);
    };
    
    // Note: This is a placeholder - actual map event binding would happen
    // in the parent component where we have access to the Leaflet map
    
    return () => {
      // Cleanup
    };
  }, [meshLayers, linkMode, selectedDevice, nodes.length]);
  
  // Update visualization when nodes or links change
  useEffect(() => {
    if (!meshLayers) return;
    
    meshLayers.clearMeshNodes();
    meshLayers.clearMeshLinks();
    
    // Add nodes
    nodes.forEach(node => {
      meshLayers.addMeshNode(
        node,
        (clickedNode) => handleNodeClick(clickedNode),
        (clickedNode) => handleNodeRightClick(clickedNode)
      );
    });
    
    // Add links
    meshLayers.setMeshLinks(links, nodes);
  }, [nodes, links, meshLayers]);
  
  const handleNodeClick = (node: MeshNode) => {
    if (linkMode) {
      if (!linkSourceId) {
        setLinkSourceId(node.id);
        meshLayers?.highlightNode(node.id);
      } else if (linkSourceId !== node.id) {
        // Create link
        const newLink: MeshLink = {
          sourceId: linkSourceId,
          targetId: node.id
        };
        setLinks(prev => [...prev, newLink]);
        setLinkSourceId(null);
        setLinkMode(false);
      }
    } else {
      // Edit node
      setEditingNode(node);
    }
  };
  
  const handleNodeRightClick = (node: MeshNode) => {
    // Remove node
    setNodes(prev => prev.filter(n => n.id !== node.id));
    setLinks(prev => prev.filter(l => l.sourceId !== node.id && l.targetId !== node.id));
  };
  
  const handleClearMesh = () => {
    if (confirm('Clear all nodes and links?')) {
      setNodes([]);
      setLinks([]);
      setAnalysis(null);
      setEditingNode(null);
      meshLayers?.clearAll();
    }
  };
  
  const handleDeployAnalysis = () => {
    if (nodes.length === 0) {
      alert('Add at least one node to analyze');
      return;
    }
    
    const deviceMap = new Map(devices.map(d => [d.id, d]));
    const result = analyzeDeployment(nodes, links, environmentConfig, deviceMap);
    setAnalysis(result);
  };
  
  const handleComputeLOS = () => {
    if (!selectedNodeForLOS.source || !selectedNodeForLOS.target) {
      alert('Select both source and target nodes');
      return;
    }
    
    const sourceNode = nodes.find(n => n.id === selectedNodeForLOS.source);
    const targetNode = nodes.find(n => n.id === selectedNodeForLOS.target);
    
    if (!sourceNode || !targetNode) return;
    
    const sourceDevice = devices.find(d => d.id === sourceNode.deviceType) || null;
    const targetDevice = devices.find(d => d.id === targetNode.deviceType) || null;
    
    const losResult = computeLosAndUplinks(sourceNode, targetNode, sourceDevice, targetDevice);
    
    // Show uplinks on map
    meshLayers?.addUplinkMarkers(losResult.suggestedUplinks);
    
    // Show summary
    alert(
      `Distance: ${losResult.distanceKm.toFixed(1)} km\n` +
      `LOS Likely: ${losResult.losApprox ? 'Yes' : 'No'}\n` +
      `Suggested uplinks: ${losResult.suggestedUplinks.length}\n` +
      (losResult.terrainWarnings ? `\nWarnings:\n${losResult.terrainWarnings.join('\n')}` : '')
    );
  };
  
  const handleUpdateNode = () => {
    if (!editingNode) return;
    
    setNodes(prev => prev.map(n => n.id === editingNode.id ? editingNode : n));
    setEditingNode(null);
  };
  
  const getNodeAnalysis = (nodeId: string): NodeAnalysis | undefined => {
    return analysis?.nodeAnalyses.find(a => a.nodeId === nodeId);
  };
  
  return (
    <div className="card bg-base-200 shadow-xl w-full max-w-md">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title text-lg">M3SH Builder</h3>
          {onClose && (
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              ✕
            </button>
          )}
        </div>
        
        {/* Device Palette */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Select Device</h4>
          <select
            className="select select-sm select-bordered w-full"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            {devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.label}
              </option>
            ))}
          </select>
          <p className="text-xs opacity-70">Click map to place node</p>
        </div>
        
        {/* Node List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Nodes ({nodes.length})</h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {nodes.map(node => (
              <div
                key={node.id}
                className="flex items-center justify-between p-2 bg-base-300 rounded text-xs cursor-pointer hover:bg-base-100"
                onClick={() => setEditingNode(node)}
              >
                <span className="font-medium">{node.name}</span>
                <span className="badge badge-xs">{node.role}</span>
              </div>
            ))}
            {nodes.length === 0 && (
              <p className="text-xs opacity-50 text-center py-2">No nodes yet</p>
            )}
          </div>
        </div>
        
        {/* Link Mode */}
        <div className="space-y-2">
          <button
            className={`btn btn-sm w-full ${linkMode ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setLinkMode(!linkMode);
              setLinkSourceId(null);
            }}
          >
            {linkMode ? `Link Mode: ${linkSourceId ? 'Select Target' : 'Select Source'}` : 'Draw Links'}
          </button>
          <p className="text-xs opacity-70">{links.length} link(s)</p>
        </div>
        
        {/* Environment Config */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Environment</h4>
          <select
            className="select select-sm select-bordered w-full"
            value={environmentConfig.clutterLevel}
            onChange={(e) => setEnvironmentConfig(prev => ({
              ...prev,
              clutterLevel: e.target.value as any
            }))}
          >
            <option value="urban">Urban</option>
            <option value="suburban">Suburban</option>
            <option value="rural">Rural</option>
            <option value="open">Open</option>
          </select>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <button
            className="btn btn-sm btn-primary w-full"
            onClick={handleDeployAnalysis}
            disabled={nodes.length === 0}
          >
            Deploy-M3SH (Analyze)
          </button>
          <button
            className="btn btn-sm btn-outline w-full"
            onClick={handleClearMesh}
          >
            Clear Mesh
          </button>
        </div>
        
        {/* LOS Helper */}
        <div className="divider my-2"></div>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">LOS / Uplink Helper</h4>
          <select
            className="select select-sm select-bordered w-full"
            value={selectedNodeForLOS.source || ''}
            onChange={(e) => setSelectedNodeForLOS(prev => ({ ...prev, source: e.target.value }))}
          >
            <option value="">Select Source Node</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>{node.name}</option>
            ))}
          </select>
          <select
            className="select select-sm select-bordered w-full"
            value={selectedNodeForLOS.target || ''}
            onChange={(e) => setSelectedNodeForLOS(prev => ({ ...prev, target: e.target.value }))}
          >
            <option value="">Select Target Node</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>{node.name}</option>
            ))}
          </select>
          <button
            className="btn btn-sm btn-outline w-full"
            onClick={handleComputeLOS}
            disabled={!selectedNodeForLOS.source || !selectedNodeForLOS.target}
          >
            Compute LOS & Uplinks
          </button>
        </div>
        
        {/* Analysis Results */}
        {analysis && (
          <>
            <div className="divider my-2"></div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Analysis Results</h4>
              <div className="stats stats-vertical shadow text-xs bg-base-300">
                <div className="stat p-2">
                  <div className="stat-title text-xs">Reliability</div>
                  <div className="stat-value text-lg">{analysis.reliabilityScore}%</div>
                </div>
                <div className="stat p-2">
                  <div className="stat-title text-xs">Coverage</div>
                  <div className="stat-value text-lg">{analysis.estimatedCoverageKm2} km²</div>
                </div>
                <div className="stat p-2">
                  <div className="stat-title text-xs">Isolated Nodes</div>
                  <div className="stat-value text-lg">{analysis.isolatedNodes.length}</div>
                </div>
              </div>
              
              {analysis.overallWarnings.length > 0 && (
                <div className="alert alert-warning p-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-xs">
                    {analysis.overallWarnings.map((w, i) => (
                      <div key={i}>{w}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {analysis.overallSuggestions.length > 0 && (
                <div className="alert alert-info p-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs">
                    {analysis.overallSuggestions.map((s, i) => (
                      <div key={i}>{s}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Node Editor Modal */}
        {editingNode && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Edit Node</h3>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={editingNode.name}
                    onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={editingNode.role}
                    onChange={(e) => setEditingNode({ ...editingNode, role: e.target.value as any })}
                  >
                    <option value="client">Client</option>
                    <option value="router">Router</option>
                    <option value="gateway">Gateway</option>
                    <option value="relay">Relay</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Device Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={editingNode.deviceType}
                    onChange={(e) => setEditingNode({ ...editingNode, deviceType: e.target.value })}
                  >
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>{device.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Altitude (m)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={editingNode.altitude || 0}
                    onChange={(e) => setEditingNode({ ...editingNode, altitude: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                {/* Show analysis for this node */}
                {analysis && (() => {
                  const nodeAnalysis = getNodeAnalysis(editingNode.id);
                  return nodeAnalysis ? (
                    <div className="space-y-2">
                      <div className="divider"></div>
                      <h4 className="font-semibold">Recommendations</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Status:</strong> <span className="badge badge-sm">{nodeAnalysis.status}</span></p>
                        <p><strong>Suggested Preset:</strong> {nodeAnalysis.radioConfig?.modemPreset}</p>
                        <p><strong>TX Power:</strong> {nodeAnalysis.radioConfig?.txPower} dBm</p>
                        <p><strong>Antenna Gain:</strong> {nodeAnalysis.radioConfig?.antennaGain} dB</p>
                      </div>
                      {nodeAnalysis.suggestions.length > 0 && (
                        <div className="alert alert-info p-2 text-xs">
                          {nodeAnalysis.suggestions.map((s, i) => (
                            <div key={i}>• {s}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="modal-action">
                <button className="btn btn-sm" onClick={() => setEditingNode(null)}>Cancel</button>
                <button className="btn btn-sm btn-primary" onClick={handleUpdateNode}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
