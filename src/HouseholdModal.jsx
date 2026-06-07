import React, { useState } from 'react';

export default function HouseholdModal({ visible, onClose, onCreate }) {
  const [name, setName] = useState('');
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 420, maxWidth: '90%' }}>
        <h3>Create a Household</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Household name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={() => { setName(''); onClose && onClose(); }} style={{ padding: '8px 12px' }}>Cancel</button>
          <button onClick={() => { if (!name.trim()) return; onCreate && onCreate(name.trim()); setName(''); }} style={{ padding: '8px 12px', background: '#2f7a4a', color: '#fff', border: 'none', borderRadius: 6 }}>Create</button>
        </div>
      </div>
    </div>
  );
}
