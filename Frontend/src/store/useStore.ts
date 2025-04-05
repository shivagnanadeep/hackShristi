import { create } from 'zustand';
import { User, Document, ScanResult, AuthState } from '../types';

interface Store extends AuthState {
  documents: Document[];
  scanResults: ScanResult[];
  users: User[];
  register: (name: string,email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  addDocument: (doc: Document) => void;
  addScanResult: (result: ScanResult) => void;
  updateUserCredits: (userId: string, credits: number) => void;
  incrementScansToday: (userId: string) => void;
  getTopUsers: () => User[];
  findMatchingDocuments: (doc: Document) => Document[];
}

const SIMILARITY_THRESHOLD = 0.8; 

function cosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
  const dotProduct = Object.keys(vecA).reduce((sum, key) => {
    return sum + (vecA[key] || 0) * (vecB[key] || 0);
  }, 0);

  const magnitudeA = Math.sqrt(Object.keys(vecA).reduce((sum, key) => {
    return sum + Math.pow(vecA[key] || 0, 2);
  }, 0));

  const magnitudeB = Math.sqrt(Object.keys(vecB).reduce((sum, key) => {
    return sum + Math.pow(vecB[key] || 0, 2);
  }, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0; 

  return dotProduct / (magnitudeA * magnitudeB);
}

const useStore = create<Store>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,
  error: null,
  documents: [
    {
      id: 'built-in-1',
      userId: 'system',
      name: 'Sample Document 1',
      content: 'This is a sample document for testing document matching.',
      uploadDate: new Date().toISOString(),
      wordFrequency: {},
      isBuiltIn: true
    },
  ],
  scanResults: [],
  users: [],
  
  register: (email, password) => {
    const existingUser = get().users.find(u => u.email === email);
    if (existingUser) {
      set({ error: 'Email already exists' });
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      role: email.endsWith('@admin.com') ? 'admin' : 'user',
      credits: 20,
      scansToday: 0,
      lastScanDate: new Date().toISOString(),
      totalScans: 0
    };

    set(state => ({
      users: [...state.users, newUser],
      currentUser: newUser,
      isAuthenticated: true,
      error: null
    }));
  },

  login: (email, password) => {
    const user = get().users.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      set({ currentUser: user, isAuthenticated: true, error: null });
    } else {
      set({ error: 'Invalid credentials' });
    }
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false, error: null });
  },
  
  addDocument: (doc) => set((state) => ({
    documents: [...state.documents, doc]
  })),
  
  addScanResult: (result) => set((state) => ({
    scanResults: [...state.scanResults, result]
  })),
  
  updateUserCredits: (userId, credits) => set((state) => ({
    users: state.users.map(user => 
      user.id === userId ? { ...user, credits } : user
    )
  })),
  
  incrementScansToday: (userId) => set((state) => ({
    users: state.users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            scansToday: user.scansToday + 1,
            credits: user.credits - 1,
            totalScans: (user.totalScans || 0) + 1
          } 
        : user
    )
  })),

  getTopUsers: () => {
    const { users } = get();
    return [...users]
      .sort((a, b) => (b.totalScans || 0) - (a.totalScans || 0))
      .slice(0, 5);
  },

  findMatchingDocuments: (doc: Document) => {
    const { documents } = get();
    const builtInDocs = documents.filter(d => d.isBuiltIn);
    
    return builtInDocs.filter(builtInDoc => {
      const similarity = cosineSimilarity(doc.wordFrequency, builtInDoc.wordFrequency);
      return similarity >= SIMILARITY_THRESHOLD;
    });
  }
}));

export default useStore;