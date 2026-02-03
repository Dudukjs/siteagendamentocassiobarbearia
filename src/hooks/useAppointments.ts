
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { startOfDay, endOfDay } from 'date-fns';

export interface Appointment {
    id?: string;
    name: string;
    phone: string;
    service_id: string;
    date: string; // ISO string
}

export function useAppointments() {
    const [loading, setLoading] = useState(false);

    const getAppointmentsByDate = async (date: Date) => {
        // Check environment variable validation
        if (!import.meta.env.VITE_SUPABASE_URL) return [];

        setLoading(true);
        const start = startOfDay(date).toISOString();
        const end = endOfDay(date).toISOString();

        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .gte('date', start)
            .lte('date', end);

        setLoading(false);
        if (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
        return data as Appointment[];
    };

    const createAppointment = async (appointment: Appointment) => {
        if (!import.meta.env.VITE_SUPABASE_URL) {
            console.warn("Supabase not configured. Mocking success.");
            return { ...appointment, id: 'mock-id' };
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointment])
            .select()
            .single();

        setLoading(false);
        if (error) throw error;
        return data;
    };

    const cancelAppointment = async (id: string) => {
        if (!import.meta.env.VITE_SUPABASE_URL) return;

        setLoading(true);
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id);

        setLoading(false);
        if (error) throw error;
    };

    const getAppointmentsByPhone = async (phone: string) => {
        if (!import.meta.env.VITE_SUPABASE_URL) return [];

        setLoading(true);
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('phone', phone)
            .gte('date', new Date().toISOString()) // Only future appointments
            .order('date', { ascending: true });

        setLoading(false);
        if (error) {
            console.error('Error fetching appointments by phone:', error);
            return [];
        }
        return data as Appointment[];
    };

    return { getAppointmentsByDate, getAppointmentsByPhone, createAppointment, cancelAppointment, loading };
}
