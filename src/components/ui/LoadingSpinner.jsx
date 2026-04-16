export default function LoadingSpinner({ fullscreen = false }) {
  const spinner = (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-golf-300 border-t-golf-600 rounded-full animate-spin" />
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-golf-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
