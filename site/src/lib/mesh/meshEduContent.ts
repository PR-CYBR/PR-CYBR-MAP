/**
 * M3SH-EDU Content
 * 
 * Training and learning resources for mesh networking
 */

export interface TrainingGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  link?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export const trainingCategories = [
  {
    id: 'hardware',
    name: 'Hardware Guides',
    description: 'Learn about Meshtastic-compatible hardware devices',
    icon: '🔧'
  },
  {
    id: 'software',
    name: 'Software Guides',
    description: 'Software tools and applications for mesh networking',
    icon: '💻'
  },
  {
    id: 'network',
    name: 'Network Guides',
    description: 'Networking concepts and protocols',
    icon: '🌐'
  },
  {
    id: 'system',
    name: 'System Guides',
    description: 'Operating system configuration and optimization',
    icon: '⚙️'
  },
  {
    id: 'platform',
    name: 'Platform Guides',
    description: 'Using PR-CYBR-MAP and related platforms',
    icon: '📱'
  }
];

export const trainingGuides: TrainingGuide[] = [
  // Hardware Guides
  {
    id: 'spec5-trekker-bravo',
    title: 'Spec5 Trekker Bravo Setup',
    category: 'hardware',
    description: 'Complete guide to setting up and configuring the Spec5 Trekker Bravo device',
    link: 'https://meshtastic.org',
    difficulty: 'beginner',
    tags: ['spec5', 'setup', 'configuration']
  },
  {
    id: 'spec5-trekker-mini',
    title: 'Spec5 Trekker Mini Guide',
    category: 'hardware',
    description: 'Compact device setup for portable mesh networking',
    link: 'https://meshtastic.org',
    difficulty: 'beginner',
    tags: ['spec5', 'portable']
  },
  {
    id: 'spec5-trekker-copilot',
    title: 'Spec5 Trekker Copilot Installation',
    category: 'hardware',
    description: 'Vehicle-mounted base station configuration',
    link: 'https://meshtastic.org',
    difficulty: 'intermediate',
    tags: ['spec5', 'vehicle', 'base-station']
  },
  {
    id: 'morosx-manet',
    title: 'MorosX LoRa MANET Deployment',
    category: 'hardware',
    description: 'Military-grade MANET node setup and operation',
    link: 'https://meshtastic.org',
    difficulty: 'advanced',
    tags: ['morosx', 'military-grade', 'manet']
  },
  {
    id: 'rak-wisblock',
    title: 'RAKWireless WisBlock Build',
    category: 'hardware',
    description: 'Modular IoT platform assembly and programming',
    link: 'https://meshtastic.org',
    difficulty: 'intermediate',
    tags: ['rakwireless', 'modular', 'iot']
  },
  {
    id: 'lilygo-t-echo',
    title: 'LILYGO T-Echo Configuration',
    category: 'hardware',
    description: 'E-ink display device setup for low-power operation',
    link: 'https://meshtastic.org',
    difficulty: 'beginner',
    tags: ['lilygo', 'e-ink', 'low-power']
  },
  {
    id: 'lilygo-t-beam',
    title: 'LILYGO T-Beam Quick Start',
    category: 'hardware',
    description: 'Popular ESP32-based device configuration',
    link: 'https://meshtastic.org',
    difficulty: 'beginner',
    tags: ['lilygo', 'esp32', 'popular']
  },
  {
    id: 'rtl-sdr-v4',
    title: 'USB RTL-SDR V4 Setup',
    category: 'hardware',
    description: 'Software-defined radio for monitoring mesh traffic',
    link: 'https://www.rtl-sdr.com',
    difficulty: 'intermediate',
    tags: ['sdr', 'monitoring', 'usb']
  },
  
  // Software Guides
  {
    id: 'meshtastic-macos',
    title: 'Meshtastic App for macOS',
    category: 'software',
    description: 'Installing and using Meshtastic on macOS',
    link: 'https://meshtastic.org/docs/software/apple',
    difficulty: 'beginner',
    tags: ['meshtastic', 'macos', 'desktop']
  },
  {
    id: 'meshtastic-windows',
    title: 'Meshtastic App for Windows',
    category: 'software',
    description: 'Windows desktop application setup',
    link: 'https://meshtastic.org/docs/software/windows',
    difficulty: 'beginner',
    tags: ['meshtastic', 'windows', 'desktop']
  },
  {
    id: 'meshtastic-linux',
    title: 'Meshtastic on Linux',
    category: 'software',
    description: 'Command-line and GUI tools for Linux',
    link: 'https://meshtastic.org/docs/software/linux',
    difficulty: 'intermediate',
    tags: ['meshtastic', 'linux', 'cli']
  },
  {
    id: 'meshtastic-android',
    title: 'Meshtastic for Android',
    category: 'software',
    description: 'Mobile app configuration for Android devices',
    link: 'https://meshtastic.org/docs/software/android',
    difficulty: 'beginner',
    tags: ['meshtastic', 'android', 'mobile']
  },
  {
    id: 'meshtastic-ios',
    title: 'Meshtastic for iOS',
    category: 'software',
    description: 'iPhone and iPad app setup',
    link: 'https://meshtastic.org/docs/software/apple/ios',
    difficulty: 'beginner',
    tags: ['meshtastic', 'ios', 'mobile']
  },
  {
    id: 'tailscale-guide',
    title: 'Tailscale VPN Setup',
    category: 'software',
    description: 'Zero-config VPN for secure mesh access',
    link: 'https://tailscale.com/kb/start',
    difficulty: 'intermediate',
    tags: ['vpn', 'tailscale', 'security']
  },
  {
    id: 'zerotier-guide',
    title: 'ZeroTier Network Setup',
    category: 'software',
    description: 'Software-defined networking for distributed teams',
    link: 'https://docs.zerotier.com',
    difficulty: 'intermediate',
    tags: ['vpn', 'zerotier', 'sdn']
  },
  {
    id: 'discord-ops',
    title: 'Discord for Emergency Ops',
    category: 'software',
    description: 'Using Discord for emergency communications',
    difficulty: 'beginner',
    tags: ['discord', 'communications', 'emergency']
  },
  {
    id: 'signal-secure',
    title: 'Signal Secure Messaging',
    category: 'software',
    description: 'End-to-end encrypted communications',
    link: 'https://signal.org',
    difficulty: 'beginner',
    tags: ['signal', 'encryption', 'messaging']
  },
  
  // Network Guides
  {
    id: 'macos-networking',
    title: 'macOS Network Configuration',
    category: 'network',
    description: 'Network settings and troubleshooting for macOS',
    difficulty: 'intermediate',
    tags: ['macos', 'networking', 'configuration']
  },
  {
    id: 'windows-networking',
    title: 'Windows Network Setup',
    category: 'network',
    description: 'Configuring Windows for mesh networking',
    difficulty: 'intermediate',
    tags: ['windows', 'networking', 'setup']
  },
  {
    id: 'linux-networking',
    title: 'Linux Network Configuration',
    category: 'network',
    description: 'Advanced Linux networking with iptables and routing',
    difficulty: 'advanced',
    tags: ['linux', 'networking', 'advanced']
  },
  {
    id: 'android-networking',
    title: 'Android Network Settings',
    category: 'network',
    description: 'Mobile hotspot and tethering configuration',
    difficulty: 'beginner',
    tags: ['android', 'mobile', 'hotspot']
  },
  {
    id: 'ios-networking',
    title: 'iOS Network Configuration',
    category: 'network',
    description: 'iPhone/iPad network and VPN settings',
    difficulty: 'beginner',
    tags: ['ios', 'mobile', 'vpn']
  },
  {
    id: 'meshtastic-networking',
    title: 'Meshtastic Network Concepts',
    category: 'network',
    description: 'Understanding mesh topology and routing',
    link: 'https://meshtastic.org/docs/overview/mesh-algo',
    difficulty: 'intermediate',
    tags: ['meshtastic', 'mesh', 'routing']
  },
  {
    id: 'reticulum-networking',
    title: 'Reticulum Network Stack',
    category: 'network',
    description: 'Cryptography-based networking for resilient communications',
    link: 'https://reticulum.network',
    difficulty: 'advanced',
    tags: ['reticulum', 'cryptography', 'resilient']
  },
  {
    id: 'tailscale-networking',
    title: 'Tailscale Mesh Networking',
    category: 'network',
    description: 'WireGuard-based mesh VPN configuration',
    link: 'https://tailscale.com/kb/mesh',
    difficulty: 'intermediate',
    tags: ['tailscale', 'wireguard', 'vpn']
  },
  {
    id: 'zerotier-networking',
    title: 'ZeroTier Virtual Networks',
    category: 'network',
    description: 'Creating and managing virtual networks',
    link: 'https://docs.zerotier.com',
    difficulty: 'intermediate',
    tags: ['zerotier', 'virtual-network', 'sdn']
  },
  {
    id: 'osi-model',
    title: 'OSI Model Overview',
    category: 'network',
    description: 'Understanding the 7-layer network model',
    difficulty: 'beginner',
    tags: ['osi', 'fundamentals', 'theory']
  },
  
  // System Guides
  {
    id: 'macos-system',
    title: 'macOS System Optimization',
    category: 'system',
    description: 'Optimizing macOS for mesh operations',
    difficulty: 'intermediate',
    tags: ['macos', 'optimization', 'system']
  },
  {
    id: 'windows-system',
    title: 'Windows System Configuration',
    category: 'system',
    description: 'Windows power and performance settings',
    difficulty: 'intermediate',
    tags: ['windows', 'performance', 'system']
  },
  {
    id: 'linux-system',
    title: 'Linux System Administration',
    category: 'system',
    description: 'Server and desktop Linux configuration',
    difficulty: 'advanced',
    tags: ['linux', 'admin', 'server']
  },
  {
    id: 'android-system',
    title: 'Android System Settings',
    category: 'system',
    description: 'Android device optimization and troubleshooting',
    difficulty: 'beginner',
    tags: ['android', 'optimization', 'mobile']
  },
  {
    id: 'ios-system',
    title: 'iOS System Configuration',
    category: 'system',
    description: 'iPhone/iPad system settings and management',
    difficulty: 'beginner',
    tags: ['ios', 'settings', 'mobile']
  },
  
  // Platform Guides
  {
    id: 'pr-cybr-map-user',
    title: 'PR-CYBR-MAP User Guide',
    category: 'platform',
    description: 'Using the PR-CYBR emergency response map',
    link: '/PR-CYBR-MAP/docs',
    difficulty: 'beginner',
    tags: ['pr-cybr', 'map', 'emergency']
  },
  {
    id: 'github-basics',
    title: 'GitHub Collaboration',
    category: 'platform',
    description: 'Contributing to open source projects',
    link: 'https://docs.github.com',
    difficulty: 'beginner',
    tags: ['github', 'collaboration', 'open-source']
  },
  {
    id: 'discord-setup',
    title: 'Discord Server Setup',
    category: 'platform',
    description: 'Creating and managing Discord communities',
    link: 'https://support.discord.com',
    difficulty: 'beginner',
    tags: ['discord', 'community', 'setup']
  },
  {
    id: 'telegram-bots',
    title: 'Telegram Bot Integration',
    category: 'platform',
    description: 'Automating alerts with Telegram bots',
    link: 'https://core.telegram.org/bots',
    difficulty: 'intermediate',
    tags: ['telegram', 'bots', 'automation']
  },
  {
    id: 'signal-groups',
    title: 'Signal Group Management',
    category: 'platform',
    description: 'Organizing secure group communications',
    link: 'https://signal.org/blog/signal-private-group-system',
    difficulty: 'beginner',
    tags: ['signal', 'groups', 'security']
  }
];

export function getGuidesByCategory(categoryId: string): TrainingGuide[] {
  return trainingGuides.filter(guide => guide.category === categoryId);
}

export function searchGuides(query: string): TrainingGuide[] {
  const lowerQuery = query.toLowerCase();
  return trainingGuides.filter(guide =>
    guide.title.toLowerCase().includes(lowerQuery) ||
    guide.description.toLowerCase().includes(lowerQuery) ||
    guide.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
