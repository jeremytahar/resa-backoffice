import { NavLink } from 'react-router-dom'
import styles from '../styles/SideBar.module.css'
import logo from '../assets/img/logoExpoLongBlanc-min-Grand.png'

export default function Sidebar({ onLogout }) {
    return (
        <aside className={styles.sidebar}>
            <div>
                <div className={styles.logo}>
                <img src={logo} alt="Logo" />
                </div>
                <nav className={styles.nav}>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Tableau de bord
                    </NavLink>
                    <NavLink to="/reservations" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Réservations
                    </NavLink>
                    <NavLink to="/stats" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Statistiques
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Calendrier
                    </NavLink>
                </nav>
            </div>
            <button className={styles.logoutBtn} onClick={onLogout}>
                Déconnexion
            </button>
        </aside>
    )
}
