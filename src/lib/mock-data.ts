export interface SmartBin {
  id: string;
  deviceName: string;
  location: string;
  distanceCm: number;
  fillPercentage: number;
  status: "empty" | "medium" | "full";
  lastUpdated: string;
  online: boolean;
  espId: string;
}

export interface Alert {
  id: string;
  type: "warning" | "critical" | "offline";
  message: string;
  binId: string;
  timestamp: string;
  read: boolean;
}

export const smartBins: SmartBin[] = [
  { id: "BIN-001", deviceName: "ESP32-Node-A1", location: "Building A - Lobby", distanceCm: 28, fillPercentage: 12, status: "empty", lastUpdated: "2025-04-16 09:42:15", online: true, espId: "ESP-A1-3F2C" },
  { id: "BIN-002", deviceName: "ESP32-Node-A2", location: "Building A - Cafeteria", distanceCm: 12, fillPercentage: 65, status: "medium", lastUpdated: "2025-04-16 09:41:30", online: true, espId: "ESP-A2-7D1E" },
  { id: "BIN-003", deviceName: "ESP32-Node-B1", location: "Building B - Entrance", distanceCm: 3, fillPercentage: 92, status: "full", lastUpdated: "2025-04-16 09:40:50", online: true, espId: "ESP-B1-9A4F" },
  { id: "BIN-004", deviceName: "ESP32-Node-B2", location: "Building B - Lab 201", distanceCm: 18, fillPercentage: 45, status: "medium", lastUpdated: "2025-04-16 09:39:10", online: true, espId: "ESP-B2-1C8D" },
  { id: "BIN-005", deviceName: "ESP32-Node-C1", location: "Building C - Parking", distanceCm: 30, fillPercentage: 5, status: "empty", lastUpdated: "2025-04-16 09:38:00", online: false, espId: "ESP-C1-5E2B" },
  { id: "BIN-006", deviceName: "ESP32-Node-C2", location: "Building C - Garden", distanceCm: 2, fillPercentage: 95, status: "full", lastUpdated: "2025-04-16 09:42:01", online: true, espId: "ESP-C2-8F3A" },
  { id: "BIN-007", deviceName: "ESP32-Node-D1", location: "Building D - Hall", distanceCm: 22, fillPercentage: 30, status: "empty", lastUpdated: "2025-04-16 09:37:45", online: true, espId: "ESP-D1-2G7C" },
  { id: "BIN-008", deviceName: "ESP32-Node-D2", location: "Building D - Office", distanceCm: 8, fillPercentage: 78, status: "medium", lastUpdated: "2025-04-16 09:41:55", online: true, espId: "ESP-D2-4H9E" },
];

export const alerts: Alert[] = [
  { id: "ALR-001", type: "critical", message: "BIN-003 is full (92%) - Collection needed", binId: "BIN-003", timestamp: "2025-04-16 09:40:50", read: false },
  { id: "ALR-002", type: "critical", message: "BIN-006 is full (95%) - Immediate collection required", binId: "BIN-006", timestamp: "2025-04-16 09:42:01", read: false },
  { id: "ALR-003", type: "warning", message: "BIN-008 reaching 80% capacity", binId: "BIN-008", timestamp: "2025-04-16 09:41:55", read: false },
  { id: "ALR-004", type: "offline", message: "ESP32-Node-C1 device offline", binId: "BIN-005", timestamp: "2025-04-16 09:20:00", read: true },
];

export const dailyWasteData = [
  { day: "Mon", avgFill: 35, collections: 3 },
  { day: "Tue", avgFill: 42, collections: 4 },
  { day: "Wed", avgFill: 55, collections: 5 },
  { day: "Thu", avgFill: 48, collections: 4 },
  { day: "Fri", avgFill: 62, collections: 6 },
  { day: "Sat", avgFill: 28, collections: 2 },
  { day: "Sun", avgFill: 20, collections: 1 },
];

export const weeklyData = [
  { week: "W1", avgFill: 38, totalCollections: 22 },
  { week: "W2", avgFill: 45, totalCollections: 28 },
  { week: "W3", avgFill: 41, totalCollections: 25 },
  { week: "W4", avgFill: 52, totalCollections: 30 },
];

export const monthlyData = [
  { month: "Jan", totalWaste: 1200, collections: 85 },
  { month: "Feb", totalWaste: 1100, collections: 78 },
  { month: "Mar", totalWaste: 1350, collections: 92 },
  { month: "Apr", totalWaste: 980, collections: 65 },
];

export const hourlyFillData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  bin1: Math.max(0, Math.min(100, 10 + Math.sin(i / 4) * 30 + Math.random() * 15)),
  bin2: Math.max(0, Math.min(100, 25 + Math.cos(i / 3) * 25 + Math.random() * 10)),
  bin3: Math.max(0, Math.min(100, 50 + Math.sin(i / 5) * 20 + Math.random() * 20)),
}));
