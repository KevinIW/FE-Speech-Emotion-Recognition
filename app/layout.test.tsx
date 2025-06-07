import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from './layout';


jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-class',
  }),
}));

describe('RootLayout Component', () => {
  test('renders children correctly', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    expect(getByText('Test Child Content')).toBeInTheDocument();
  });

  test('applies the correct structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const minHeightDiv = container.querySelector('.min-h-screen');
    expect(minHeightDiv).toBeInTheDocument();
    expect(minHeightDiv).toHaveClass('bg-gray-50');
  });
});
