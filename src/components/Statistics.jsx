import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import styles from '../styles/Statistics.module.css';

export default function Statistics({ token, onLogout }) {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchWithAuth(
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

            if (!res) return;
            const data = await res.json();
            setReservations(data);
        };

        fetchData();

            document.title = 'Statistiques - Backoffice | Alice Guy'
    }, []);

    const reservationsByDay = reservations.reduce((acc, r) => {
        const date = r.date_time.split(' ')[0];

        if (!acc[date]) {
            acc[date] = { date, count: 0, participants: 0 };
        }

        acc[date].count++;
        acc[date].participants += Number(r.participants);
        return acc;
    }, {});


    const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };


    const dataByDay = Object.values(reservationsByDay)
        .map(item => ({
            ...item,
            fullDate: item.date,
            label: formatDate(item.date),
        }))
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    const ticks = dataByDay.filter((_, index) => index % 7 === 0).map(item => item.label);


    dataByDay.sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));


    const promoData = [
        { name: 'Avec code promo', value: reservations.filter(r => r.promo_code === '1').length },
        { name: 'Sans code promo', value: reservations.filter(r => r.promo_code !== '1').length },
    ];

    const COLORS = ['#2c2c2a', '#ea5b28'];

    const totalPromo = promoData.reduce((sum, item) => sum + item.value, 0);

    const CustomFirstBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length > 0) {
            const { value } = payload[0];
            return (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    borderRadius: '4px'
                }}>
                    <div style={{ color: '#000'}}>{label}</div>
                    <div style={{ color: '#ea5b28' }}>
                        {value} réservation{value > 1 ? 's' : ''}
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomSecondBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length > 0) {
            const { value } = payload[0];
            return (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    borderRadius: '4px'
                }}>
                    <div style={{ color: '#000'}}>{label}</div>
                    <div style={{ color: '#ea5b28' }}>
                        {value} participant{value > 1 ? 's' : ''}
                    </div>
                </div>
            );
        }
        return null;
    };
    
    const CustomThirdBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length > 0) {
            const { value } = payload[0];
            return (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    borderRadius: '4px'
                }}>
                    <div style={{ color: '#000'}}>{label}</div>
                    <div style={{ color: '#ea5b28' }}>
                        {value} participant{value > 1 ? 's' : ''}
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomPromoTooltip = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const { name, value } = payload[0];
            const percent = ((value / totalPromo) * 100).toFixed(1);
            return (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    borderRadius: '4px'
                }}>
                    <strong style={{ color: '#000' }}>{name}</strong><br />
                    <div style={{ color: '#ea5b28' }}>
                    {value} réservation{value > 1 ? 's' : ''}<br />
                    {percent}%
                    </div>
                </div>
            );
        }
        return null;
    };

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    const participantsByWeekday = days.map((dayName, i) => {
        const filtered = reservations.filter(r => new Date(r.date_time).getDay() === i);
        const total = filtered.reduce((sum, r) => sum + Number(r.participants), 0);
        return { day: dayName, participants: total };
    });



    return (
        <div className={`${styles.container} container`}>
            <h2 className={`${styles.title} title`}>Statistiques</h2>

            <div className={styles.graphContainer}>
                <h3>Nombre de réservations par jour</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataByDay}>
                        <XAxis
                            dataKey="label"
                            ticks={ticks}
                        />
                        <YAxis />
                        <Tooltip content={<CustomFirstBarTooltip />} />
                        <Bar dataKey="count" fill="#ea5b28" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.graphContainer}>
                <h3>Nombre de participants par jour</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataByDay}>
                        <XAxis
                            dataKey="label"
                            ticks={ticks}
                        />
                        <YAxis />
                        <Tooltip content={<CustomSecondBarTooltip />} />
                        <Bar dataKey="participants" fill="#2c2c2a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.graphContainer}>
                <h3>Affluence par jour de la semaine</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={participantsByWeekday}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip content={<CustomThirdBarTooltip />} />
                        <Bar dataKey="participants" fill="#ea5b28" />
                    </BarChart>
                </ResponsiveContainer>
            </div>


            <div className={styles.graphContainer}>
                <h3>Répartition code promo</h3>
                <PieChart width={400} height={300}>
                    <Pie
                        data={promoData}
                        cx={200}
                        cy={150}
                        innerRadius={60}
                        outerRadius={100}
                        fill="#ea5b28"
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                        {promoData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomPromoTooltip />} />
                    <Legend />
                </PieChart>
            </div>
        </div>
    );
}
