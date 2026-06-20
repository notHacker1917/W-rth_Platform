// Inline types to avoid Vite module resolution issues
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

interface GitHubRepository {
  id: string;
  name: string;
  description: string;
  primaryLanguage: string;
  stargazersCount: number;
  forksCount: number;
  url: string;
  isFork: boolean;
  isPrivate: boolean;
}

interface ContributionGraph {
  totalContributions: number;
  contributionDays: ContributionDay[];
  pullRequestsCount: number;
  pullRequestsMerged: number;
  issuesOpened: number;
  issuesClosed: number;
}

interface CollaborationMetric {
  repositoryName: string;
  repositoryUrl: string;
  pullRequestsCount: number;
  commitsCount: number;
  role: 'collaborator' | 'contributor' | 'owner';
  organization?: string;
}

interface GitHubPortfolioData {
  username: string;
  repositoryList: GitHubRepository[];
  contributionGraph: ContributionGraph;
  collaborationMetrics: CollaborationMetric[];
  profileUrl: string;
  lastFetched: string;
}

// Generate contribution data for last 365 days
function generateContributionDays(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create realistic contribution pattern
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseCount = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8);
    const count = baseCount + (Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0);
    
    // Map count to intensity level
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0 && count <= 4) level = 1;
    else if (count > 4 && count <= 8) level = 2;
    else if (count > 8 && count <= 12) level = 3;
    else if (count > 12) level = 4;
    
    days.push({
      date: date.toISOString().split('T')[0],
      count,
      level,
    });
  }
  
  return days;
}

export const mockGitHubPortfolio: GitHubPortfolioData = {
  username: 'alex-mueller',
  profileUrl: 'https://github.com/alex-mueller',
  lastFetched: new Date().toISOString(),
  repositoryList: [
    {
      id: 'repo-1',
      name: 'wireless-sensor-network',
      description: 'IoT platform for distributed environmental monitoring using LoRaWAN protocol stack',
      primaryLanguage: 'C++',
      stargazersCount: 142,
      forksCount: 28,
      url: 'https://github.com/alex-mueller/wireless-sensor-network',
      isFork: false,
      isPrivate: false,
    },
    {
      id: 'repo-2',
      name: 'power-converter-sim',
      description: 'SPICE simulation framework for resonant DC-DC converter optimization',
      primaryLanguage: 'Python',
      stargazersCount: 89,
      forksCount: 15,
      url: 'https://github.com/alex-mueller/power-converter-sim',
      isFork: false,
      isPrivate: false,
    },
    {
      id: 'repo-3',
      name: 'embedded-rtos',
      description: 'Lightweight RTOS kernel for ARM Cortex-M microcontrollers with preemptive scheduling',
      primaryLanguage: 'C',
      stargazersCount: 234,
      forksCount: 52,
      url: 'https://github.com/alex-mueller/embedded-rtos',
      isFork: false,
      isPrivate: false,
    },
    {
      id: 'repo-4',
      name: 'vhdl-neural-accelerator',
      description: 'Hardware neural network accelerator implemented in VHDL for edge inference',
      primaryLanguage: 'VHDL',
      stargazersCount: 78,
      forksCount: 12,
      url: 'https://github.com/alex-mueller/vhdl-neural-accelerator',
      isFork: false,
      isPrivate: false,
    },
    {
      id: 'repo-5',
      name: 'pcb-design-toolkit',
      description: 'Utilities and validation scripts for automated PCB manufacturing checks',
      primaryLanguage: 'Python',
      stargazersCount: 45,
      forksCount: 8,
      url: 'https://github.com/alex-mueller/pcb-design-toolkit',
      isFork: false,
      isPrivate: false,
    },
    {
      id: 'repo-6',
      name: 'firmware-bootloader',
      description: 'Secure bootloader implementation with OTA update capabilities for embedded systems',
      primaryLanguage: 'C',
      stargazersCount: 156,
      forksCount: 34,
      url: 'https://github.com/alex-mueller/firmware-bootloader',
      isFork: false,
      isPrivate: false,
    },
  ],
  contributionGraph: {
    totalContributions: 1247,
    pullRequestsCount: 34,
    pullRequestsMerged: 32,
    issuesOpened: 18,
    issuesClosed: 16,
    contributionDays: generateContributionDays(),
  },
  collaborationMetrics: [
    {
      repositoryName: 'student-hardware-projects',
      repositoryUrl: 'https://github.com/org/student-hardware-projects',
      pullRequestsCount: 8,
      commitsCount: 42,
      role: 'collaborator',
      organization: 'WürthElectronics',
    },
    {
      repositoryName: 'embedded-systems-hackathon-2025',
      repositoryUrl: 'https://github.com/org/embedded-systems-hackathon-2025',
      pullRequestsCount: 5,
      commitsCount: 28,
      role: 'collaborator',
      organization: 'HackathonOrganization',
    },
    {
      repositoryName: 'open-source-rtos',
      repositoryUrl: 'https://github.com/org/open-source-rtos',
      pullRequestsCount: 12,
      commitsCount: 87,
      role: 'contributor',
      organization: 'OpenSourceProject',
    },
  ],
};
