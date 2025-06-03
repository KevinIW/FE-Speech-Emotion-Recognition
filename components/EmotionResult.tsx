import React from 'react';

interface EmotionResultProps {
  result: {
    emotion: string;
    confidence: number;
    probabilities: Record<string, number>;
  };
}

// Emotion color and emoji mapping
const emotionData: Record<string, { color: string; emoji: string }> = {
  marah: { color: 'bg-red-500', emoji: '😡' },
  jijik: { color: 'bg-green-500', emoji: '🤢' },
  takut: { color: 'bg-purple-500', emoji: '😨' },
  bahagia: { color: 'bg-yellow-500', emoji: '😄' },
  netral: { color: 'bg-gray-500', emoji: '😐' },
  sedih: { color: 'bg-blue-500', emoji: '😢' },
};

const EmotionResult: React.FC<EmotionResultProps> = ({ result }) => {
  // Sort probabilities in descending order
  const sortedEmotions = Object.entries(result.probabilities)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-6xl mb-2">
            {emotionData[result.emotion]?.emoji || '🤔'}
          </div>
          <h3 className="text-2xl font-bold capitalize">
            {result.emotion}
          </h3>
          <p className="text-gray-600">
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold uppercase text-gray-500 mb-3">
          Emotion Probabilities
        </h4>
        <div className="space-y-3">
          {sortedEmotions.map(([emotion, probability]) => (
            <div key={emotion} className="flex items-center">
              <div className="w-20 text-sm capitalize">{emotion}</div>
              <div className="flex-1 mx-2">
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${emotionData[emotion]?.color || 'bg-gray-500'}`}
                    style={{ width: `${probability * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm text-right">
                {(probability * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionResult;
