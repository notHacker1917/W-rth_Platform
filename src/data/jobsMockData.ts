// Inline type definitions to avoid Vite module resolution issues
type JobCategory = 'Working Student' | 'Internship' | 'Research Assistant' | 'HiWi';
type Department = 'Power Modules' | 'Wireless Connectivity & Sensors' | 'Embedded Systems';

interface JobListing {
  id: string;
  title: string;
  department: Department;
  type: JobCategory;
  location: string;
  description: string;
  requiredSkills: string[];
  hardwareStack: string[];
  applicationUrl: string;
}

export const jobListings: JobListing[] = [
  {
    id: 'job-1',
    title: 'PCB Design Internship',
    department: 'Power Modules',
    type: 'Internship',
    location: 'Ludwigsburg, Germany',
    description: 'Join our Power Modules team to design and optimize printed circuit boards for high-efficiency power conversion solutions. You will work with state-of-the-art CAD tools and collaborate with experienced engineers on real-world projects.',
    requiredSkills: ['KiCAD', 'Circuit Analysis', 'SPICE Simulation', 'VHDL'],
    hardwareStack: ['Passive Components', 'Power Semiconductors', 'Magnetic Components'],
    applicationUrl: 'https://careers.wuerth.com/job-1',
  },
  {
    id: 'job-2',
    title: 'Firmware Development Working Student',
    department: 'Embedded Systems',
    type: 'Working Student',
    location: 'Ludwigsburg, Germany',
    description: 'Develop embedded firmware for IoT devices and sensors. You\'ll work with microcontrollers, real-time operating systems, and communication protocols. Great opportunity to apply your programming knowledge in a production environment.',
    requiredSkills: ['C/C++', 'ARM Cortex', 'FreeRTOS', 'CAN/I2C/SPI'],
    hardwareStack: ['Microcontrollers', 'Sensors', 'Communication Modules'],
    applicationUrl: 'https://careers.wuerth.com/job-2',
  },
  {
    id: 'job-3',
    title: 'Wireless Connectivity Research Assistant',
    department: 'Wireless Connectivity & Sensors',
    type: 'Research Assistant',
    location: 'Ludwigsburg, Germany',
    description: 'Conduct research on 5G and WiFi 6 technologies for industrial IoT applications. Participate in prototyping, measurement campaigns, and data analysis. Publish your findings in collaboration with the research team.',
    requiredSkills: ['RF Circuit Design', 'MATLAB', 'Signal Processing', 'Network Protocols'],
    hardwareStack: ['RF Components', 'Antennas', 'Network Processors'],
    applicationUrl: 'https://careers.wuerth.com/job-3',
  },
  {
    id: 'job-4',
    title: 'HiWi - Sensor Integration',
    department: 'Wireless Connectivity & Sensors',
    type: 'HiWi',
    location: 'Ludwigsburg, Germany',
    description: 'Support the Sensor Integration team in designing multi-sensor platforms for environmental monitoring. Test hardware prototypes and develop calibration procedures. Ideal for students with hands-on experience.',
    requiredSkills: ['Electronics', 'Python', 'Data Analysis', 'Lab Work'],
    hardwareStack: ['Environmental Sensors', 'Signal Conditioning Circuits', 'ADC Modules'],
    applicationUrl: 'https://careers.wuerth.com/job-4',
  },
  {
    id: 'job-5',
    title: 'Power Electronics Design Internship',
    department: 'Power Modules',
    type: 'Internship',
    location: 'Ludwigsburg, Germany',
    description: 'Design and simulate power conversion circuits with high efficiency and reliability. Work on DC-DC converters, power factor correction, and energy storage systems. Collaborate with cross-functional teams.',
    requiredSkills: ['SPICE', 'Circuit Simulation', 'Power Electronics Theory', 'Thermal Management'],
    hardwareStack: ['MOSFETs', 'IGBTs', 'Capacitors', 'Inductors'],
    applicationUrl: 'https://careers.wuerth.com/job-5',
  },
  {
    id: 'job-6',
    title: 'Software Engineer - Embedded Systems',
    department: 'Embedded Systems',
    type: 'Working Student',
    location: 'Ludwigsburg, Germany',
    description: 'Build robust firmware for industrial control systems. Optimize code for performance and memory footprint. Work with version control, automated testing, and CI/CD pipelines.',
    requiredSkills: ['C', 'Git', 'Linux', 'Debugging Techniques'],
    hardwareStack: ['ARM Processors', 'Memory Controllers', 'Communication Interfaces'],
    applicationUrl: 'https://careers.wuerth.com/job-6',
  },
  {
    id: 'job-7',
    title: 'RF Systems Internship',
    department: 'Wireless Connectivity & Sensors',
    type: 'Internship',
    location: 'Ludwigsburg, Germany',
    description: 'Design and characterize RF systems for wireless communications. Conduct antenna simulations, perform spectrum analysis, and validate prototypes. Gain experience with modern RF tools and methodologies.',
    requiredSkills: ['RF Design', 'ADS/HFSS', 'Spectrum Analysis', 'Network Analysis'],
    hardwareStack: ['Antennas', 'RF Filters', 'Amplifiers', 'Oscillators'],
    applicationUrl: 'https://careers.wuerth.com/job-7',
  },
  {
    id: 'job-8',
    title: 'HiWi - Test Engineering',
    department: 'Power Modules',
    type: 'HiWi',
    location: 'Ludwigsburg, Germany',
    description: 'Develop and execute test procedures for power module products. Set up measurement equipment, analyze test data, and document results. Support quality assurance processes.',
    requiredSkills: ['Test Engineering', 'Measurement Instruments', 'Data Analysis', 'Technical Writing'],
    hardwareStack: ['Power Modules', 'Test Equipment', 'Thermal Cameras'],
    applicationUrl: 'https://careers.wuerth.com/job-8',
  },
];
