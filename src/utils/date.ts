
import { addMinutes, format, getDay, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OPENING_HOURS } from './constants';

export const isWorkDay = (date: Date) => {
    const day = getDay(date);
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

export const getOpeningHours = (date: Date) => {
    const day = getDay(date);
    if (day === 6) return OPENING_HOURS.saturday;
    if (day === 0) return OPENING_HOURS.sunday;
    return null;
};

export const generateTimeSlots = (date: Date) => {
    const hours = getOpeningHours(date);
    if (!hours) return [];

    const slots: Date[] = [];
    let currentChange = setMinutes(setHours(date, hours.start), 0);
    const endChange = setMinutes(setHours(date, hours.end), 0);

    while (currentChange < endChange) {
        slots.push(new Date(currentChange));
        currentChange = addMinutes(currentChange, 30);
    }

    return slots;
};

export const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
};

export const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
};
