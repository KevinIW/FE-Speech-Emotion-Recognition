import React from 'react';

const Header = () => {
  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold text-primary-700">Speech Emotion Recognition</h1>
      <p className="text-gray-600 mt-2">
        Upload an audio file to analyze the emotion in the speech
      </p>
    </header>
  );
};

export default Header;
