import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  test('renders the heading correctly', () => {
    render(<Header />);
    
    expect(screen.getByText('Speech Emotion Recognition')).toBeInTheDocument();
  });

  test('renders the subheading text', () => {
    render(<Header />);
    
    expect(screen.getByText(/Upload an audio file to analyze the emotion in the speech/i)).toBeInTheDocument();
  });

  test('has the correct heading tag', () => {
    render(<Header />);
    
    const headingElement = screen.getByText('Speech Emotion Recognition');
    expect(headingElement.tagName).toBe('H1');
  });
});
