// components/GlobalLoader.jsx
import { useEffect, useState } from 'react';
import { loadingStore } from '../../services/http/LoadingStore';

export default function GlobalLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => loadingStore.subscribe(setVisible), []);

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>Loading...</div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  box: {
    padding: '12px 18px',
    background: '#fff',
    borderRadius: 8,
    fontWeight: 600,
  },
};
