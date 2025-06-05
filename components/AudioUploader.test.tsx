import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioUploader from './AudioUploader';

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiUpload: () => <div data-testid="mock-upload-icon" />,
  FiX: () => <div data-testid="mock-close-icon" />,
}));

describe('AudioUploader Component', () => {
  const mockProps = {
    onFileSelect: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
    selectedFile: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders upload area correctly', () => {
    render(<AudioUploader {...mockProps} />);
    
    expect(screen.getByText(/Drag and drop an audio file here/i)).toBeInTheDocument();
    expect(screen.getByText(/Supported formats: WAV, MP3, OGG/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-upload-icon')).toBeInTheDocument();
  });

  test('submit button is disabled when no file is selected', () => {
    render(<AudioUploader {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /Analyze Emotion/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('bg-gray-300');
  });

  test('displays selected file info when file is selected', () => {
    const file = new File(['dummy content'], 'test-audio.mp3', { type: 'audio/mp3' });
    const props = { ...mockProps, selectedFile: file };
    
    render(<AudioUploader {...props} />);
    
    expect(screen.getByText('test-audio.mp3')).toBeInTheDocument();
    expect(screen.getByText(/KB/)).toBeInTheDocument();
    expect(screen.getByTestId('mock-close-icon')).toBeInTheDocument();
  });

  test('submit button is enabled when file is selected', () => {
    const file = new File(['dummy content'], 'test-audio.mp3', { type: 'audio/mp3' });
    const props = { ...mockProps, selectedFile: file };
    
    render(<AudioUploader {...props} />);
    
    const submitButton = screen.getByRole('button', { name: /Analyze Emotion/i });
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveClass('bg-primary-600');
  });

  test('shows loading state when isLoading is true', () => {
    const props = {
      ...mockProps,
      isLoading: true,
      selectedFile: new File(['dummy content'], 'test-audio.mp3', { type: 'audio/mp3' })
    };
    
    render(<AudioUploader {...props} />);
    
    expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();
  });
});
