
// Sidebar Component
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Sidebar({ isOpen, onClose, children }: SidebarProps) {
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
        className={`overflow-y-auto fixed top-0 right-0 h-full sm:w-40 md:w-60 lg:w-100 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {children}
      </div>
    </>
  );
}

export default Sidebar;