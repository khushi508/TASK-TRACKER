import { useEffect } from "react";

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification-${type}`} role="alert">
      <span>{message}</span>
      <button className="notification-close" onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  );
}
