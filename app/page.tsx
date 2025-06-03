'use client';

import { useState } from 'react';
import axios from 'axios';
import AudioUploader from '@/components/AudioUploader';
import EmotionResult from '@/components/EmotionResult';
import Header from '@/components/Header';

// Define the API URL - change this to your deployed API URL when ready
const API_URL = 'http://localhost:8000';

// Define the response type
interface PredictionResponse {
  emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    // Reset previous results when a new file is selected
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an audio file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<PredictionResponse>(
        `${API_URL}/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error('Error during prediction:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error: ${err.response.data.detail || 'Failed to process audio'}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <AudioUploader 
          onFileSelect={handleFileSelect} 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          selectedFile={file}
        />
        
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <EmotionResult result={result} />
          </div>
        )}
      </div>
    </main>
  );
}
