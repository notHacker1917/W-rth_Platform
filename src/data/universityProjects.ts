import type { UniversityProject } from '../types';

/**
 * University–Würth Elektronik Project Registry
 * 8 cross-faculty institutional hardware projects leveraging
 * Würth Elektronik sponsored electronics across German technical universities.
 */
export const UNIVERSITY_PROJECTS: UniversityProject[] = [

  // ── 1 · Automated BMS for Formula Student Electric Racing ──────────────
  {
    projectId: 'ureg-001',
    title: 'Automated Battery Management System for Formula Student Electric Racing Car',
    hostingChair: 'Chair of Automotive Electronics & Mechatronics — TU Munich',
    primaryDomain: 'Electrical Engineering',
    activeContributors: 12,
    status: 'In Progress',
    technicalStack: [
      'LTC6813-1 18-Cell Battery Stack Monitor (isoSPI)',
      'WE-PD Shielded Power Inductor 744024 — 4.7 µH (DC-DC Aux Rail)',
      'WE-CMB Capacitor-Bead Filter (HV Isolation Rail)',
      'WE-MPSB Ferrite Bead — 600Ω @ 100 MHz (CAN Bus Lines)',
      'STM32G4 Series MCU (120 MHz, FPU)',
      'CAN FD / ISO 11898-1 Protocol Stack',
      'C + FreeRTOS (Cell Balancing State Machine)',
      'KiCad 7 (6-layer, IPC-2221 Class 3)',
      'MATLAB / Simulink (SoC / SoH Estimation)',
    ],
    summary:
      'Develops a safety-critical BMS for an 18S6P Li-NMC accumulator (560V, 6.5 kWh) used in a Formula Student EV competing at the Hockenheimring. The system implements passive cell balancing, real-time SoC estimation via extended Kalman filter, and hardware-enforced over-voltage/over-temperature interlock via dedicated galvanic isolation ICs — bridging motorsport-grade functional-safety practices (ISO 26262 ASIL-B) with student-accessible open hardware.',
  },

  // ── 2 · Decentralized Smart Grid Energy Metering Nodes ────────────────
  {
    projectId: 'ureg-002',
    title: 'Decentralized Smart Grid Energy Metering Nodes with Hardware-Secured Communication',
    hostingChair: 'Chair of Power Systems & Energy Automation — RWTH Aachen University',
    primaryDomain: 'Electrical Engineering',
    activeContributors: 8,
    status: 'Completed',
    technicalStack: [
      'WE-eiSos THEBE-II LTE-M / NB-IoT Module (AT Commands, eDRX)',
      'ATECC608B Cryptographic Co-processor (ECC-P256, AES-128)',
      'WE-MAPI Shielded SMD Inductor — 47 µH (3.3 V Buck Stage)',
      'WE-CBF Capacitor-Bead Filter (RF Supply Decoupling)',
      'Texas Instruments MSP430FR5994 Ultra-Low-Power MCU',
      'DLMS / COSEM Metering Protocol (IEC 62056)',
      'AES-256-GCM Authenticated Encryption (MQTT-TLS 1.3)',
      'C (Energia Framework) + Python (Backend Aggregation)',
    ],
    summary:
      'Designed and deployed a mesh of 24 tamper-resistant smart energy meters across the RWTH campus micro-grid, each node independently calculating active/reactive power via a CS5490 energy AFE and reporting signed, encrypted payloads over LTE-M to a central FIWARE Orion broker. Hardware-root-of-trust via the ATECC608B prevents replay attacks and meter-data spoofing, demonstrating a viable pathway for utility-grade metering in distributed renewable energy deployments.',
  },

  // ── 3 · High-Frequency Anechoic Chamber EMI Test Fixture ──────────────
  {
    projectId: 'ureg-003',
    title: 'High-Frequency Anechoic Chamber Automated Test Fixture for EMI/EMC Component Screening',
    hostingChair: 'Chair of Electromagnetic Compatibility — Technical University of Berlin',
    primaryDomain: 'Electronics',
    activeContributors: 6,
    status: 'Seeking Hardware Sponsor',
    technicalStack: [
      'WE-MPSB Ferrite Bead Array — 1 kΩ @ 100 MHz (DUT Bias Network)',
      'WE-CMB Common-Mode Choke Array (30 MHz – 1 GHz Test Range)',
      'WE-CLFS AC-Line EMI Filter (Mains Supply Conditioning)',
      'WE-CBF Capacitor-Bead Filter Grid (Per-Port Isolation)',
      'Rohde & Schwarz ESR7 EMI Test Receiver (VISA / GPIB Interface)',
      'NI PXIe-1082 Platform (Automated Switching Matrix)',
      'Python 3.11 (pyvisa · numpy · pandas · Plotly)',
      'CISPR 25 / EN 55032 / IEC 61000-4-6 Test Specifications',
    ],
    summary:
      'Building a fully-automated pre-compliance EMI screening fixture inside a 3m × 3m RF-shielded enclosure, capable of unattended overnight component characterisation across 9 kHz – 1 GHz. A Python-orchestrated test executive controls the R&S ESR7 via VISA, sequences a 32-port DUT switching matrix, and generates PDF CISPR 25 delta-limit reports per device-under-test — cutting manual screening time from 4 hours to under 12 minutes per component family.',
  },

  // ── 4 · Autonomous Agricultural Robotics Power Distribution Board ──────
  {
    projectId: 'ureg-004',
    title: 'Autonomous Agricultural Robotics Power Distribution Board with Overcurrent Protection',
    hostingChair: 'Chair of Agricultural Systems Engineering & Precision Robotics — University of Hohenheim',
    primaryDomain: 'Electrical Engineering',
    activeContributors: 9,
    status: 'In Progress',
    technicalStack: [
      'WE-MagI³C FDSM Power Module — 6A, 4V–36V (Regulated 5V Rail)',
      'WE-CBFP Power Line Filter (24V Main Bus EMI Suppression)',
      'WE-MPSB Ferrite Bead — 300Ω @ 100 MHz (Servo Signal Lines)',
      'TPS25941 Programmable eFuse IC (Per-Channel Current Limiting)',
      'STM32F767ZI MCU (216 MHz, USB-FS, FDCAN)',
      'CANopen Protocol (CiA 402 — Motor Drive Profile)',
      'ROS 2 Humble (Ubuntu 22.04 on Nvidia Jetson Orin Nano)',
      'C / FreeRTOS (Power Distribution Firmware)',
      'KiCad 7 (4-layer PCB, IP54 conformal coating)',
    ],
    summary:
      'Designing a ruggedised 24V power distribution hub for a six-wheel differential-drive crop-monitoring robot operating in unstructured vineyard terrain. Each of the 12 load channels features independent eFuse-based overcurrent protection, real-time current telemetry via I²C, and automatic load-shedding priority arbitration — ensuring navigation, LiDAR, and comms subsystems remain powered during peak motor-inrush events, advancing safety-critical power management standards for outdoor agricultural robotics.',
  },

  // ── 5 · High-Efficiency Solar Inverter with SiC MOSFET Gate Drivers ───
  {
    projectId: 'ureg-005',
    title: 'High-Efficiency Single-Phase Solar Inverter Topology using SiC MOSFET Gate Drivers',
    hostingChair: 'Chair of Power Electronics & Renewable Energy Systems — KIT Karlsruhe',
    primaryDomain: 'Electrical Engineering',
    activeContributors: 14,
    status: 'Completed',
    technicalStack: [
      'Wolfspeed C3M0065090D 900V SiC MOSFET (Full-Bridge Topology)',
      'WE-GDT Gate Drive Transformer — 1:1, 50 ns Rise Time',
      'WE-CMB Common-Mode Choke — 2 × 10 mH (LCL Filter)',
      'WE-CLFS AC Line EMI Filter (Grid-Tie Interface)',
      'WE-PD Power Inductor (DC-link Ripple Suppression)',
      'Texas Instruments TMDSCNCD28379D DSP (SPWM, 20 kHz switching)',
      'PLECS Simulation (Thermal & Loss Modelling)',
      'MPPT Perturb-and-Observe Algorithm (C, CLA co-processor)',
      'IEC 62109-1 Safety Standard / VDE-AR-N 4105 Grid Code',
    ],
    summary:
      'Developed and validated a 5 kW grid-tied solar inverter achieving 97.8% CEC-weighted efficiency by replacing silicon IGBTs with 900V SiC MOSFETs and WE-GDT gate drive transformers, reducing switching losses by 41% at 20 kHz. The LCL filter — wound using WE common-mode chokes — suppresses grid-injected current THD to 1.9% (EN 61000-3-2 Class A), providing a replicable open-hardware reference design suitable for small-scale renewable installations at KIT research facilities.',
  },

  // ── 6 · Edge-Computing Gateway for Industrial Predictive Maintenance ───
  {
    projectId: 'ureg-006',
    title: 'Edge-Computing Gateway Interface Board for Industrial Machine Predictive Maintenance',
    hostingChair: 'Chair of Industrial Automation & Cyber-Physical Systems — TU Darmstadt',
    primaryDomain: 'Electronics',
    activeContributors: 7,
    status: 'In Progress',
    technicalStack: [
      'WE-eiSos CALYPSO Wi-Fi 4 Module (802.11n, SPI Bridge)',
      'WE-CBF Capacitor-Bead Filter — 100 pF (RF Supply Isolation)',
      'WE-MPSB Ferrite Bead (RS-485 Bus Termination Rails)',
      'WE-MagI³C FDSM — 3A (3.3V/1.8V Logic Rails)',
      'NVIDIA Jetson Orin NX 16 GB (AI Inference, TensorFlow Lite)',
      'RS-485 / Modbus RTU (Machine PLC Interface)',
      'MQTT over TLS 1.3 + OPC-UA (Cloud Uplink)',
      'Python 3.11 + C++ (Edge Inference Pipeline)',
      'Docker on Preempt-RT Linux (Hard Real-Time Guarantees)',
    ],
    summary:
      'Building an industrial-grade edge gateway that ingests vibration, temperature, and acoustic data from up to 16 legacy CNC machine tools over Modbus RTU, runs a quantised LSTM anomaly-detection model on the Jetson Orin NX, and streams structured OPC-UA data to a private AWS IoT Greengrass node — enabling predictive maintenance alerts with sub-30ms local inference latency and eliminating cloud-round-trip bottlenecks in the factory floor network.',
  },

  // ── 7 · Multi-Channel Signal Conditioning DAQ Board ───────────────────
  {
    projectId: 'ureg-007',
    title: 'Multi-Channel Signal Conditioning DAQ Board for High-Precision Laboratory Sensor Arrays',
    hostingChair: 'Chair of Measurement Technology & Sensor Systems — University of Stuttgart',
    primaryDomain: 'Electronics',
    activeContributors: 5,
    status: 'In Progress',
    technicalStack: [
      'Texas Instruments ADS131M08 24-bit Delta-Sigma ADC (8-ch, 32 kSPS)',
      'WE-MPSB Ferrite Bead — 600Ω (Analog Guard Ring Isolation)',
      'WE-CBF Capacitor-Bead Filter Array (Per-Channel Anti-alias)',
      'WE-CMB Common-Mode Choke (Differential Input Conditioning)',
      'OPA2182 Zero-Drift Rail-to-Rail Instrumentation Amplifier',
      'STM32H743 MCU (480 MHz, SDRAM Interface, USB-HS)',
      'SPI / I²C / USB-HS (Host PC Communication)',
      'MATLAB + Python (scipy · numpy · PyQtGraph Live Display)',
      'IEC 61000-4-6 Conducted RF Immunity Verification',
    ],
    summary:
      'Designing a compact 8-channel synchronous DAQ front-end achieving 120 dB dynamic range at 32 kSPS per channel, targeting sub-nV/√Hz noise floors for precision strain-gauge, thermopile, and Wheatstone bridge sensor arrays in materials-testing rigs. A per-channel WE-CBF anti-alias filter bank combined with a ferrite-bead analog guard ring reduces digital switching noise coupling below the ADC thermal noise floor, producing laboratory-grade measurement fidelity at one-quarter the cost of commercial NI DAQ modules.',
  },

  // ── 8 · Inductive Wireless Charging Platform for AGVs ─────────────────
  {
    projectId: 'ureg-008',
    title: 'Inductive Wireless Charging Platform Prototype for Warehouse Automated Guided Vehicles',
    hostingChair: 'Chair of Industrial Electronics & Wireless Power Transfer — TU Dresden',
    primaryDomain: 'Electrical Engineering',
    activeContributors: 11,
    status: 'Seeking Hardware Sponsor',
    technicalStack: [
      'WE-WPCC Wireless Power Charging Coil — 200W class, 110 µH (Tx/Rx Pair)',
      'WE-MagI³C FDSM Power Module — 17A (LLC Resonant Stage Supply)',
      'WE-GDT Gate Drive Transformer — Isolated Half-Bridge Drive',
      'WE-CMB Common-Mode Choke (AC Input EMI Filtering)',
      'WE-MPSB Ferrite Bead Array (DC Bus Decoupling)',
      'STM32G0B1 MCU (LLC Frequency Modulation Control)',
      'LLC Resonant Converter Topology (100 kHz switching)',
      'Qi2 / SAE J2954 WPT1 Standard Compliance',
      'C + FreeRTOS (Alignment Detection, Foreign Object Detection)',
      'KiCad 7 (2× 6-layer coil driver + receiver PCBs)',
    ],
    summary:
      'Prototyping a floor-embedded 200W wireless charging pad system for 48V LiFePO4-powered AGVs operating in an automated warehouse, enabling opportunity charging during natural work-cycle pauses without manual connector docking. The LLC resonant topology driven by WE-GDT isolated gate transformers achieves 91.3% coil-to-battery efficiency at 150mm air gap, while a STM32-based foreign object detection loop disables the transmitter within 8ms of metallic intrusion — demonstrating production-feasible autonomous charging infrastructure for Industry 4.0 logistics environments.',
  },
];

export const getRegistryProjectById = (id: string): UniversityProject | undefined =>
  UNIVERSITY_PROJECTS.find(p => p.projectId === id);
