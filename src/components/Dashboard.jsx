import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Dashboard.module.css';
import ReservationTable from './ReservationTable.jsx';
import { fetchWithAuth } from '../utils/fetchWithAuth.js';

export default function Dashboard({ token, onLogout }) {
  const [lastReservations, setLastReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState({});

  const fetchLastReservations = async () => {
    const response = await fetchWithAuth(
      'https://tahar.projetsmmichamps.fr/API/index.php?last5=true',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      onLogout
    );
    if (!response) return;
    const data = await response.json();
    setLastReservations(data);
  };

  const fetchAllReservations = async () => {
    const response = await fetchWithAuth(
      'https://tahar.projetsmmichamps.fr/API/index.php',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      onLogout
    );
    if (!response) return;
    const data = await response.json();
    setAllReservations(data);
  };

  const deleteReservation = async (id) => {

    const response = await fetch('https://tahar.projetsmmichamps.fr/API/index.php', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    if (data.success) {
      fetchLastReservations();
      window.location.reload();
    } else {
      alert('Erreur suppression : ' + data.message);
    }
  };

  const saveReservation = async (id, updatedData) => {
    const response = await fetch('https://tahar.projetsmmichamps.fr/API/index.php', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updatedData }),
    });

    const data = await response.json();
    if (data.success) {
      fetchLastReservations();
    } else {
      alert('Erreur mise à jour : ' + data.message);
    }
  };

  useEffect(() => {
    fetchLastReservations();
    fetchAllReservations();
    document.title = 'Tableau de bord - Backoffice | Alice Guy'
  }, []);

  const today = new Date().toISOString().split('T')[0];
  console.log(today);
  const todayReservations = allReservations.filter(r => {
    const resDate = new Date(r.date_time).toISOString().split('T')[0];
    return resDate === today;
  });


  return (
    <div className={`${styles.container} container`}>
      <h2 className={`${styles.title} title`}>Tableau de bord</h2>

      <div className={styles.statsContainer}>
        <h3 className={styles.subTitle}>Statistiques</h3>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.cardBlue}`}>
            <h4>Total réservations</h4>
            <p>{allReservations.length}</p>
          </div>
          <div className={`${styles.statCard} ${styles.cardGreen}`}>
            <h4>Total participants</h4>
            <p>{allReservations.reduce((sum, r) => sum + Number(r.participants), 0)}</p>
          </div>
          <div className={`${styles.statCard} ${styles.cardYellow}`}>
            <h4>Avec code promo</h4>
            <p>{allReservations.filter(r => r.promo_code === '1').length}</p>
          </div>
          <div className={`${styles.statCard} ${styles.cardPink}`}>
            <h4>Réservations aujourd’hui</h4>
            <p>{todayReservations.length}</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/stats" className={styles.buttonLink}>Voir plus de statistiques</Link>
        </div>
      </div>

      <h3 className={styles.subTitle}>5 dernières réservations</h3>
      <ReservationTable
        reservations={lastReservations}
        onDelete={deleteReservation}
        onSave={saveReservation}
        editId={editId}
        setEditId={setEditId}
        formValues={formValues}
        setFormValues={setFormValues}
      />
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/reservations" className={styles.buttonLink}>Voir toutes les réservations</Link>
      </div>
    </div>
  );
}
