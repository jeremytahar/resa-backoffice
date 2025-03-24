import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { FaUser, FaCalendarAlt, FaUsers, FaEnvelope, FaPhone, FaTag } from 'react-icons/fa';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import '../styles/Calendar.css';

export default function Calendar({ token, onLogout }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchReservations = async () => {
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

        console.log(data);

        const formattedEvents = data.map(res => ({
            id: res.id,
            title: `${res.first_name} ${res.last_name} (${parseInt(res.participants, 10)} pers)`,
            start: res.date_time,
            end: new Date(new Date(res.date_time).getTime() + 90 * 60 * 1000).toISOString(),
            first_name: res.first_name,
            last_name: res.last_name,
            email: res.email,
            phone_number: res.phone_number,
            participants: res.participants,
            promo_code: res.promo_code,
        }));

        setEvents(formattedEvents);
    };

    useEffect(() => {
        fetchReservations();
        document.title = 'Calendrier - Backoffice | Alice Guy'
    }, []);

    const handleEventClick = (info) => {
        const eventId = info.event.id;
        const event = events.find(e => e.id === eventId);
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <div className='container'>
            <h2 className="title">Calendrier des réservations</h2>
            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                locale={frLocale}
                events={events}
                allDaySlot={false}
                slotMinTime="09:30:00"
                slotMaxTime="20:00:00"
                height="auto"
                validRange={{
                    start: '2025-03-24',
                    end: '2025-05-25'
                }}
                initialDate="2025-03-24"
                eventClick={handleEventClick}
            />

            {isModalOpen && selectedEvent && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Détails de la réservation</h3>
                            <span className="close-btn" onClick={closeModal}>&times;</span>
                        </div>
                        <div className="modal-body">
                            <p><FaUser className="icon" /> <strong>Nom complet:</strong> <span className="value">{selectedEvent.first_name} {selectedEvent.last_name}</span></p>
                            <p><FaCalendarAlt className="icon" /> <strong>Date et Heure:</strong> <span className="value">{new Date(selectedEvent.start).toLocaleString('fr-FR', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}</span></p>
                            <p><FaUsers className="icon" /> <strong>Participants:</strong> <span className="value">{selectedEvent.participants} personne{selectedEvent.participants > 1 ? 's' : ''}</span></p>
                            <p><FaEnvelope className="icon" /> <strong>Email:</strong> <span className="value">{selectedEvent.email}</span></p>
                            <p><FaPhone className="icon" /> <strong>Téléphone:</strong> <span className="value">{selectedEvent.phone_number}</span></p>
                            <p><FaTag className="icon" /> <strong>Code promo:</strong> <span className="value">{selectedEvent.promo_code === '1' ? 'Oui' : 'Non'}</span></p>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
