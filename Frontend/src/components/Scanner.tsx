import React, { useState } from 'react';
import { Upload, Search, Download } from 'lucide-react';
import useStore from '../store/useStore';
import { calculateWordFrequency, cosineSimilarity } from '../utils/textAnalysis';

const Scanner: React.FC = () => {
  const { currentUser, addDocument, addScanResult, incrementScansToday, findMatchingDocuments } = useStore();
  const [scanning, setScanning] = useState(false);
  const [matchedDocs, setMatchedDocs] = useState<Array<{ name: string, content: string }>>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    if (currentUser.scansToday >= 20 || currentUser.credits <= 0) {
      alert('No more scans available today or insufficient credits');
      return;
    }

    setScanning(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const wordFrequency = calculateWordFrequency(content);
      
      const document = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        name: file.name,
        content,
        uploadDate: new Date().toISOString(),
        wordFrequency
      };
      
      addDocument(document);
      
      // Find matching documents
      const matches = findMatchingDocuments(document);
      setMatchedDocs(matches.map(doc => ({
        name: doc.name,
        content: doc.content
      })));

      // Record scan result
      if (matches.length > 0) {
        matches.forEach(match => {
          const similarity = cosineSimilarity(document.wordFrequency, match.wordFrequency);
          addScanResult({
            similarity,
            method: 'cosine',
            document1: document.name,
            document2: match.name,
            timestamp: new Date().toISOString(),
            userId: currentUser.id
          });
        });
      }

      incrementScansToday(currentUser.id);
      setScanning(false);
    };
    
    reader.readAsText(file);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Document Scanner</h2>
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            {scanning ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">Scanning...</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload .txt file to scan</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".txt"
                  onChange={handleFileUpload}
                />
              </>
            )}
          </label>

          {currentUser && (
            <div className="text-sm text-gray-600 text-center">
              Credits: {currentUser.credits} | Scans today: {currentUser.scansToday}/20
            </div>
          )}
        </div>
      </div>

      {matchedDocs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Matching Documents Found</h3>
          <div className="space-y-4">
            {matchedDocs.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">{doc.name}</span>
                <button
                  onClick={() => handleDownload(doc.content, doc.name)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;