import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmotionResult from './EmotionResult';

describe('EmotionResult Component', () => {
  const mockResult = {
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
  };

  test('renders the primary emotion correctly', () => {
    render(<EmotionResult result={mockResult} />);
    
    // Use more specific selector to target the heading with the emotion
    expect(screen.getByRole('heading', { name: 'bahagia' })).toBeInTheDocument();
    expect(screen.getByText(/Confidence: 85.00%/i)).toBeInTheDocument();
  });

  test('renders emotion probabilities section', () => {
    render(<EmotionResult result={mockResult} />);
    
    expect(screen.getByText('Emotion Probabilities')).toBeInTheDocument();
  });

  test('renders all emotion probabilities correctly', () => {
    render(<EmotionResult result={mockResult} />);
    
    // Check percentages appear in the output
    expect(screen.getByText('85.0%')).toBeInTheDocument();
    expect(screen.getByText('5.0%')).toBeInTheDocument();
    expect(screen.getByText('3.0%')).toBeInTheDocument();
    expect(screen.getByText('2.0%')).toBeInTheDocument();
    expect(screen.getByText('1.0%')).toBeInTheDocument();
    expect(screen.getByText('4.0%')).toBeInTheDocument();
  });
});
