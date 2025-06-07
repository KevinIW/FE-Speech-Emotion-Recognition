import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from './page';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


jest.mock('@/components/AudioUploader', () => {
  return function MockAudioUploader({ onFileSelect, onSubmit, isLoading, selectedFile }: any) {
    return (
      <div data-testid="mock-audio-uploader">
        <button 
          data-testid="select-file-button" 
          onClick={() => onFileSelect(new File(['dummy'], 'test.mp3', { type: 'audio/mp3' }))}
        >
          Select File
        </button>
        <button 
          data-testid="remove-file-button" 
          onClick={() => onFileSelect(null)}
        >
          Remove File
        </button>
        <button 
          data-testid="submit-button" 
          onClick={onSubmit}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    );
  };
});

jest.mock('@/components/EmotionResult', () => {
  return function MockEmotionResult({ result }: any) {
    return <div data-testid="emotion-result">{result.emotion}</div>;
  };
});

jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.post.mockReset();
  });

  test('renders the header and audio uploader', () => {
    render(<Home />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-audio-uploader')).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        emotion: 'bahagia',
        confidence: 0.85,
        probabilities: {}
      }
    });

    render(<Home />);
    
  
    fireEvent.click(screen.getByTestId('select-file-button'));
    fireEvent.click(screen.getByTestId('submit-button'));
    

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  test('handles file removal', async () => {
    render(<Home />);
    
 
    fireEvent.click(screen.getByTestId('select-file-button'));
    
    
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
    
   
    fireEvent.click(screen.getByTestId('remove-file-button'));
    
   
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('displays error message on API failure', async () => {
    // Mock a rejected promise with the specific error structure
    mockedAxios.post.mockImplementationOnce(() => {
      return Promise.reject(new Error('Test error message'));
    });
    
    render(<Home />);
    
 
    fireEvent.click(screen.getByTestId('select-file-button'));
    fireEvent.click(screen.getByTestId('submit-button'));
    
   
    await waitFor(() => {
     
      const errorElement = screen.getByText((content) => {
        return content.includes('An unexpected error occurred');
      });
      expect(errorElement).toBeInTheDocument();
    });
  });

  test('displays results on successful API call', async () => {
    const mockResponse = {
      data: {
        emotion: 'bahagia',
        confidence: 0.85,
        probabilities: {
          bahagia: 0.85,
          sedih: 0.05,
          marah: 0.03,
          takut: 0.02,
          jijik: 0.01,
          netral: 0.04
        }
      }
    };
    
  
    mockedAxios.post.mockImplementationOnce(() => {
      return Promise.resolve(mockResponse);
    });
    
    render(<Home />);
    

    fireEvent.click(screen.getByTestId('select-file-button'));
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
    
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
      
      expect(screen.getByTestId('emotion-result')).toBeInTheDocument();
      expect(screen.getByText('bahagia')).toBeInTheDocument();
    }, { timeout: 3000 }); 
  });
});
