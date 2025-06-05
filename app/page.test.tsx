import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from './page';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock components
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
    // Reset mocks before each test
    mockedAxios.post.mockReset();
  });

  test('renders the header and audio uploader', () => {
    render(<Home />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-audio-uploader')).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    // Pre-configure axios mock to return a successful response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        emotion: 'bahagia',
        confidence: 0.85,
        probabilities: {}
      }
    });

    render(<Home />);
    
    // Use fireEvent directly without act - we'll wait for the effects later
    fireEvent.click(screen.getByTestId('select-file-button'));
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Wait for the async effects to complete
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  test('handles file removal', async () => {
    render(<Home />);
    
    // First select a file
    fireEvent.click(screen.getByTestId('select-file-button'));
    
    // Verify submit button is enabled
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
    
    // Then remove it
    fireEvent.click(screen.getByTestId('remove-file-button'));
    
    // Submit button should be disabled
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('displays error message on API failure', async () => {
    // Mock a rejected promise with the specific error structure
    mockedAxios.post.mockImplementationOnce(() => {
      return Promise.reject(new Error('Test error message'));
    });
    
    render(<Home />);
    
    // Select file and submit
    fireEvent.click(screen.getByTestId('select-file-button'));
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Now look for the generic error message that the component actually displays
    await waitFor(() => {
      // Use a more flexible text matcher by function
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
    
    // Ensure this mock is correctly resolved
    mockedAxios.post.mockImplementationOnce(() => {
      return Promise.resolve(mockResponse);
    });
    
    render(<Home />);
    
    // Trigger file selection and form submission
    fireEvent.click(screen.getByTestId('select-file-button'));
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Wait for the results to appear - need to check for text instead of testid
    // since the MockEmotionResult component isn't being rendered
    await waitFor(() => {
      // Check for the Analysis Results heading that appears when results are shown
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
      // And then verify our mock component is there with the emotion text
      expect(screen.getByTestId('emotion-result')).toBeInTheDocument();
      expect(screen.getByText('bahagia')).toBeInTheDocument();
    }, { timeout: 3000 }); // Increase timeout to give more time for component to update
  });
});
