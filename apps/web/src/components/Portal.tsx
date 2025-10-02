import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  target?: Element | DocumentFragment;
  children?: React.ReactNode;
}

export default function Portal({ children, target = document.body }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, target) : null;
}
