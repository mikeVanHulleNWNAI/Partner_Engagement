import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

// Sidebar Component
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  positionFromTop: number;
}

function Sidebar({ 
    isOpen, 
    onClose, 
    children, 
    backgroundColor = 'bg-white',
    positionFromTop = 16
  }: SidebarProps) {
  const [width, setWidth] = useState(384); // Default width (w-96 = 384px)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const minWidth = 200;
  const maxWidth = 800;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const windowWidth = window.innerWidth;
      const newWidth = windowWidth - e.clientX;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 transition-opacity"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{ width: `${width}px` }}
        className={`overflow-y-auto fixed top-${positionFromTop} right-0 h-full ${backgroundColor} shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute left-0 top-0 h-full w-1 cursor-ew-resize bg-gray-300 hover:bg-blue-500 active:bg-blue-600 transition-colors"
          style={{
            background: isResizing ? '#3b82f6' : undefined,
          }}
        >
          <div className="absolute left-0 top-0 h-full w-2 -translate-x-1/2" />
        </div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="z-50 !p-1.5 !rounded-md !bg-white !hover:bg-gray-100 !border !border-gray-300 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
        {children}
      </div>
    </>
  );
}

export default Sidebar;