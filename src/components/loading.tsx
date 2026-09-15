'use client';

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center text-white"
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"
        role="status"
        aria-label="Loading content"
      />
    </div>
  );
}
