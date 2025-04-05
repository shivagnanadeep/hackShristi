import React from 'react';
import { FileText } from 'lucide-react';
import useStore from '../store/useStore';

const DocumentList: React.FC = () => {
  const { documents, currentUser } = useStore();
  const userDocuments = documents.filter(doc => doc.userId === currentUser?.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
      <div className="space-y-4">
        {userDocuments.map(doc => (
          <div key={doc.id} className="flex items-center p-3 border rounded-lg">
            <FileText className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;