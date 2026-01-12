import { Employee } from './types';

/**
 * Service to handle browser native notifications for birthdays
 */
export const NotificationService = {
    /**
     * Request user permission for notifications
     */
    requestPermission: async () => {
        if (!('Notification' in window)) {
            console.warn('Este navegador no soporta notificaciones de escritorio');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    },

    /**
     * Check if anyone has a birthday today and send a notification
     */
    checkAndNotifyBirthdays: (employees: Employee[]) => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 1-12
        const currentDay = today.getDate();

        const todayBirthdayEmps = employees.filter(emp => {
            const birthDate = new Date(emp.fecha_nacimiento);
            // Correction for ISO dates which might shift days depending on local timezone
            // We extract parts directly from the string to be safe
            const parts = emp.fecha_nacimiento.split('-');
            if (parts.length === 3) {
                const m = parseInt(parts[1]);
                const d = parseInt(parts[2]);
                return m === currentMonth && d === currentDay;
            }
            return false;
        });

        todayBirthdayEmps.forEach(emp => {
            NotificationService.sendNotification(
                `¡Hoy es el cumple de ${emp.nombre}! 🎂`,
                {
                    body: '¡No olvides saludarle y celebrar en grande! 🥳🎈',
                    icon: '/favicon.ico', // Fallback icon
                    tag: `bday-${emp.id}-${currentDay}-${currentMonth}` // Prevent duplicates
                }
            );
        });
    },

    /**
     * Helper to send a notification
     */
    sendNotification: (title: string, options?: NotificationOptions) => {
        if (Notification.permission === 'granted') {
            new Notification(title, options);
        }
    }
};
