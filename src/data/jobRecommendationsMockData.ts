export interface JobRecommendation {
  userId: string;
  jobId: string;
  title: string;
  companyName: string;
  score: number; // Scaled match score, e.g. 0.90
  matchPercentage: number; // e.g. 90
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export const jobRecommendations: Record<string, JobRecommendation[]> = {
  u1: [
    {
      userId: 'u1',
      jobId: 'j1',
      title: 'Backend Engineering Intern',
      companyName: 'Meridian Labs',
      score: 0.90,
      matchPercentage: 90,
      matchedSkills: ['Go', 'Rust', 'Distributed Systems', 'Backend'],
      missingSkills: ['C++'],
      explanation: 'Excellent fit with your background in systems programming, Raft consensus, and distributed key-value stores.'
    },
    {
      userId: 'u1',
      jobId: 'job-6',
      title: 'Software Engineer - Embedded Systems',
      companyName: 'Embedded Systems Dept.',
      score: 0.88,
      matchPercentage: 88,
      matchedSkills: ['C', 'Git', 'Linux', 'Debugging Techniques'],
      missingSkills: ['ARM Processors'],
      explanation: 'Strong alignment with your Git experience and systems engineering skills from your Raft KV implementation.'
    },
    {
      userId: 'u1',
      jobId: 'job-2',
      title: 'Firmware Development Working Student',
      companyName: 'Embedded Systems Dept.',
      score: 0.78,
      matchPercentage: 78,
      matchedSkills: ['C/C++', 'CAN/I2C/SPI'],
      missingSkills: ['FreeRTOS', 'ARM Cortex'],
      explanation: 'Good match with your C/C++ background. You would need to pick up FreeRTOS and microcontrollers.'
    },
    {
      userId: 'u1',
      jobId: 'job-4',
      title: 'HiWi - Sensor Integration',
      companyName: 'Wireless Connectivity & Sensors Dept.',
      score: 0.52,
      matchPercentage: 52,
      matchedSkills: ['Python', 'Data Analysis'],
      missingSkills: ['Electronics', 'Lab Work'],
      explanation: 'Partial match. Your Python and data analysis skills match the calibration tasks, but you lack laboratory electronics experience.'
    }
  ],
  u2: [
    {
      userId: 'u2',
      jobId: 'j3',
      title: 'Product Design Intern',
      companyName: 'Stackform',
      score: 0.90,
      matchPercentage: 90,
      matchedSkills: ['Figma', 'Product Design', 'UX Research', 'Internship'],
      missingSkills: ['HTML/CSS'],
      explanation: 'Perfect match with your product design craft, Figma expertise, and your Onboard.fyi UX teardown project.'
    },
    {
      userId: 'u2',
      jobId: 'b5',
      title: 'Redesign Stackform Onboarding Flow (UX + Hi-Fi)',
      companyName: 'Stackform (Bounty)',
      score: 0.85,
      matchPercentage: 85,
      matchedSkills: ['Figma', 'UX Design', 'Product Design', 'Onboarding'],
      missingSkills: ['SaaS marketing'],
      explanation: 'Very strong fit. Your design background perfectly aligns with Stackform\'s requirement to optimize step 3 onboarding drop-off.'
    },
    {
      userId: 'u2',
      jobId: 'job-1',
      title: 'PCB Design Internship',
      companyName: 'Power Modules Dept.',
      score: 0.62,
      matchPercentage: 62,
      matchedSkills: ['KiCAD', 'Circuit Analysis'],
      missingSkills: ['SPICE Simulation', 'VHDL'],
      explanation: 'Moderate match. You have design concepts, but need to adapt to hardware CAD tools (KiCAD) and circuit simulation.'
    }
  ],
  u3: [
    {
      userId: 'u3',
      jobId: 'j2',
      title: 'Data Engineer (Full-time)',
      companyName: 'GreenPulse',
      score: 0.90,
      matchPercentage: 90,
      matchedSkills: ['Python', 'SQL', 'Data Engineering', 'Climate'],
      missingSkills: ['Kafka', 'Flink'],
      explanation: 'Outstanding match. Aligns with your data science background, SQL/Python proficiency, and your passion for climate tech.'
    },
    {
      userId: 'u3',
      jobId: 'j5',
      title: 'Climate Data Analyst Intern',
      companyName: 'GreenPulse',
      score: 0.88,
      matchPercentage: 88,
      matchedSkills: ['Python', 'Data Analysis', 'Climate', 'Internship'],
      missingSkills: ['Tableau Server'],
      explanation: 'Superb fit. Directly leverages your experience building the AirView Austin real-time environmental dashboard.'
    },
    {
      userId: 'u3',
      jobId: 'b4',
      title: 'Urban Tree Coverage vs Urban Heat Island',
      companyName: 'GreenPulse (Bounty)',
      score: 0.82,
      matchPercentage: 82,
      matchedSkills: ['Python', 'Data Analysis', 'GIS', 'Climate', 'Statistics'],
      missingSkills: ['R'],
      explanation: 'Excellent alignment. The dataset analysis requires geospatial correlation models similar to your AirView Austin project.'
    },
    {
      userId: 'u3',
      jobId: 'job-8',
      title: 'HiWi - Test Engineering',
      companyName: 'Power Modules Dept.',
      score: 0.58,
      matchPercentage: 58,
      matchedSkills: ['Data Analysis', 'Technical Writing'],
      missingSkills: ['Test Engineering', 'Measurement Instruments'],
      explanation: 'Moderate match. Your statistical data analysis skills are useful for analyzing test logs, but you lack laboratory measurement experience.'
    }
  ]
};

export const getJobRecommendationsForUser = (userId: string): JobRecommendation[] => {
  return jobRecommendations[userId] || [];
};
