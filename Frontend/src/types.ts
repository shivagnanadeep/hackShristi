export interface User {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  credits: number;
  scansToday: number;
  lastScanDate: string;
  totalScans?: number;  // Track total scans for user ranking
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  content: string;
  uploadDate: string;
  wordFrequency: Record<string, number>;
  isBuiltIn?: boolean;  // Flag for built-in documents
}

export interface ScanResult {
  similarity: number;
  method: string;
  document1: string;
  document2: string;
  timestamp: string;
  userId: string;  // Track which user performed the scan
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  error: string | null;
}