import { useState, useEffect } from 'react';
import styles from '../styles/Reservations.module.css';

export default function ReservationTable({
  reservations,
  onDelete,
  onSave,
  editId,
  setEditId,
  formValues,
  setFormValues
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [allSelected, setAllSelected] = useState(false);


  const toggleCheckbox = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAllCheckboxes = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reservations.map(res => res.id));
    }
    setAllSelected(!allSelected);
  };

  useEffect(() => {
    setAllSelected(selectedIds.length === reservations.length && reservations.length > 0);
  }, [selectedIds, reservations]);


  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("Aucune réservation sélectionnée.");
    const confirmDelete = confirm('Supprimer les réservations sélectionnées ?');
    if (!confirmDelete) return;

    selectedIds.forEach(id => onDelete(id));
    setSelectedIds([]);
  };

  const handleEditChange = (e, field) => {
    let value = e.target.value;

    if (field === 'participants') {
      value = Math.max(1, Math.min(10, Number(value)));
    }

    setFormValues({ ...formValues, [field]: value });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  

  return (
    <>
      <button
        className={`${styles.btn} ${styles.btnDelete}`}
        onClick={handleDeleteSelected}
        style={{ marginBottom: '1rem' }}
        disabled={selectedIds.length === 0}
      >
        Supprimer la sélection ({selectedIds.length})
      </button>

      <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllCheckboxes}
              />
            </th>
            <th className={styles.th}>Nom</th>
            <th className={styles.th}>Prénom</th>
            <th className={styles.th}>Téléphone</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Date et heure</th>
            <th className={styles.th}>Participants</th>
            <th className={styles.th}>Code promo</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id}>
              <td className={styles.td}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(res.id)}
                  onChange={() => toggleCheckbox(res.id)}
                />
              </td>
              {editId === res.id ? (
                <>
                  <td className={styles.td}>
                    <input className={styles.input} value={formValues.last_name || ''} onChange={e => handleEditChange(e, 'last_name')} />
                  </td>
                  <td className={styles.td}>
                    <input className={styles.input} value={formValues.first_name || ''} onChange={e => handleEditChange(e, 'first_name')} />
                  </td>
                  <td className={styles.td}>
                    <input className={styles.input} value={formValues.phone_number || ''} onChange={e => handleEditChange(e, 'phone_number')} />
                  </td>
                  <td className={styles.td}>
                    <input className={styles.input} value={formValues.email || ''} onChange={e => handleEditChange(e, 'email')} />
                  </td>
                  <td className={styles.td}>
                    <input type='datetime-local' min="2025-03-24T10:00" max="2025-05-24T18:00" className={styles.input} value={formValues.date_time || ''} onChange={e => handleEditChange(e, 'date_time')} />
                  </td>
                  <td className={styles.td}>
                    <input type='number' min='1' max='10' className={styles.input} value={formValues.participants || ''} onChange={e => handleEditChange(e, 'participants')} />
                  </td>
                  <td className={styles.td}>
                    <input type='checkbox' className={styles.input} checked={formValues.promo_code === '1'} onChange={e => handleEditChange({ target: { value: e.target.checked ? '1' : '0' } }, 'promo_code')} />
                  </td>
                  <td className={styles.td}>
                    <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => { onSave(res.id, formValues); setEditId(null); }}>Enregistrer</button>
                  </td>
                </>
              ) : (
                <>
                  <td className={styles.td}>{res.last_name}</td>
                  <td className={styles.td}>{res.first_name}</td>
                  <td className={styles.td}>{res.phone_number}</td>
                  <td className={styles.td}>{res.email}</td>
                  <td className={styles.td}>{formatDateTime(res.date_time)}</td>
                  <td className={styles.td}>{res.participants}</td>
                  <td className={styles.td}>{res.promo_code === '0' ? 'Non' : 'Oui'}</td>
                  <td className={`${styles.td}`}>
                    <div className={styles.actions}>
                      <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => {
                        setEditId(res.id);
                        setFormValues(res);
                      }}>Modifier</button>
                      <button className={`${styles.btn} ${styles.btnDelete}`} onClick={() => onDelete(res.id)}>Supprimer</button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
