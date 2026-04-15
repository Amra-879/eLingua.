import { Mic, Square, Pause, Play, RotateCcw } from "lucide-react";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const calculatePrice = (seconds) => {
  if (seconds < 1) return 0;
  const base = 3.5;
  const baseSeconds = 60;
  const extraRate = 0.5;
  const extraInterval = 30;
  if (seconds <= baseSeconds) return base;
  const extraSeconds = seconds - baseSeconds;
  const extraChunks = Math.ceil(extraSeconds / extraInterval);
  return base + extraChunks * extraRate;
};

export default function AudioRecorder({
  isRecording,
  isPaused,
  duration,
  audioUrl,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}) {
  const price = calculatePrice(duration);
  const hasRecording = !!audioUrl;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* TIMER + CIJENA */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isRecording && !isPaused && (
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className="text-4xl font-mono font-bold text-gray-800">
            {formatTime(duration)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Cijena</p>
          <p className="text-2xl font-bold text-green-600">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* KONTROLE */}
      <div className="flex items-center justify-center gap-4 mb-6">

        {/* START — prikazuje se samo na početku */}
        {!isRecording && !hasRecording && (
          <button
            onClick={onStart}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition"
            title="Počni snimanje"
          >
            <Mic size={28} />
          </button>
        )}

        {/* PAUZA / NASTAVI */}
        {isRecording && (
          <>
            {!isPaused ? (
              <button
                onClick={onPause}
                className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center shadow transition"
                title="Pauziraj"
              >
                <Pause size={22} />
              </button>
            ) : (
              <button
                onClick={onResume}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow transition"
                title="Nastavi"
              >
                <Play size={22} />
              </button>
            )}

            {/* ZAUSTAVI */}
            <button
              onClick={onStop}
              className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center shadow-lg transition"
              title="Završi snimanje"
            >
              <Square size={24} />
            </button>
          </>
        )}

        {/* RESET */}
        {(isRecording || hasRecording) && (
          <button
            onClick={onReset}
            className="w-12 h-12 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 flex items-center justify-center transition"
            title="Resetuj snimanje"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      {/* STATUS TEKST */}
      <p className="text-center text-sm text-gray-400 mb-4">
        {!isRecording && !hasRecording && "Pritisni dugme za početak snimanja"}
        {isRecording && !isPaused && "Snimanje u toku..."}
        {isRecording && isPaused && "Snimanje pauzirano — pritisni za nastavak"}
        {!isRecording && hasRecording && "Snimanje završeno"}
      </p>

      {/* PLAYER za preslušavanje */}
      {hasRecording && !isRecording && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Preslušaj snimak:
          </p>
          <audio
            src={audioUrl}
            controls
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}