import React, { useState } from 'react';
import { UploadCloud, FileText, LogOut } from 'lucide-react';

export default function HomePage() {
	// state = { afterRes: false };
	const [selectedFile, setSelectedFile] = useState(null);
	const [documents] = useState([
		{
			name: 'file_01_Science_Facts.txt',
			date: '4/5/2025',
		},
	]);

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	const handleSubmit = () => {
		if (!selectedFile) return;
		const reader = new FileReader();

		reader.onload = (e) => {
			const fileContent = e.target.result;
			const fileName = selectedFile.name;

			console.log('File Name:', fileName);
			console.log('File Content:', fileContent);
		};
		reader.readAsText(selectedFile);
		// Add logic to upload/scan file here
		alert(`Submitted: ${selectedFile.name}`);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center space-x-2">
					<UploadCloud className="text-blue-600" />
					<h1 className="text-2xl font-bold">DocScanner</h1>
				</div>
				<div className="text-sm text-gray-600">
					Credits: 20 | Scans today: 0/20{' '}
					<button className="ml-2 border-none">
						<LogOut className="w-5 h-5" />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left: Document Scanner */}
				<div className="bg-white p-6 rounded-2xl shadow">
					<h2 className="text-lg font-semibold mb-4">Document Scanner</h2>
					<label className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer mb-4">
						<UploadCloud
							className="text-gray-400"
							size={32}
						/>
						<p className="text-gray-400">Upload .txt file to scan</p>
						<input
							type="file"
							accept=".txt"
							onChange={handleFileChange}
							className="hidden"
						/>
					</label>
					{selectedFile && (
						<p className="text-sm text-gray-600 mb-4">
							Selected File:{' '}
							<span className="font-medium">{selectedFile.name}</span>
						</p>
					)}
					<button
						onClick={handleSubmit}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
					>
						Submit & Scan
					</button>
					{/* {afterRes ? this.showResponse() : {}} */}
				</div>

				{/* Right: Your Documents */}
				<div className="bg-white p-6 rounded-2xl shadow">
					<h2 className="text-lg font-semibold mb-4">Your Documents</h2>
					{documents.map((doc, index) => (
						<div
							key={index}
							className="flex items-center space-x-2 bg-gray-50 border p-4 rounded-xl mb-2 hover:bg-gray-100"
						>
							<FileText className="text-blue-600" />
							<div>
								<p className="font-medium text-blue-600">{doc.name}</p>
								<p className="text-sm text-gray-500">Uploaded on {doc.date}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
