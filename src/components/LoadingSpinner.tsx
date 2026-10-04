'use client';

/**
 * LoadingSpinner component - Displays animated loading spinner
 * @param {string} size - Size variant: 'sm', 'md', or 'lg'
 * @param {string} text - Optional loading text to display below spinner
 */
export default function LoadingSpinner({ 
  size = 'md', 
  text 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  text?: string;
}) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-slate-600 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * FullPageLoader component - Full screen loading overlay
 * @param {string} text - Loading message to display
 */
export function FullPageLoader({ text = 'Memuat...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-semibold text-slate-800">{text}</p>
      </div>
    </div>
  );
}

/**
 * InlineLoader component - Inline loading indicator for content areas
 * @param {string} text - Optional loading text
 */
export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}

/**
 * ButtonLoader component - Small loader for buttons
 */
export function ButtonLoader() {
  return (
    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}
