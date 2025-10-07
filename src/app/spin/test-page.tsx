'use client';

export default function TestSpinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">🎰 Spin to Win!</h1>
        <p className="text-2xl text-gray-300">Page is loading correctly!</p>
        <button
          onClick={() => alert('Button works!')}
          className="mt-8 px-8 py-4 bg-green-500 text-white text-xl rounded-lg hover:bg-green-600"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}
