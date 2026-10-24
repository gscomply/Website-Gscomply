import { useEffect, useRef, useId, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md';
}

/** Small accessible dialog: Escape closes, focus moves in and is restored, backdrop click closes. */
export default function Modal({ open, title, onClose, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || []
      );
    // Focus the first form field if there is one, otherwise the first control
    const first = panel?.querySelector<HTMLElement>('input, textarea, select') || focusable()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-white rounded-xl shadow-xl w-full ${size === 'sm' ? 'max-w-sm' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <h2 id={titleId} className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 -mr-1 text-gray-400 hover:text-gray-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 pb-6 flex flex-wrap items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#1A6B3C] rounded-md hover:bg-[#155a32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
export const btnSecondary =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
export const btnDanger =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
