import { supabase } from './supabaseClient';
import { Employee, Payment, Config, Expense, EventPhoto } from './types';

export const getEmployees = async (): Promise<Employee[]> => {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('nombre');

    if (error) throw error;
    return data || [];
};

export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
    const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', employee.id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) throw error;
};

export const getPayments = async (): Promise<Payment[]> => {
    const { data, error } = await supabase
        .from('payments')
        .select('*');

    if (error) throw error;
    return data || [];
};

export const togglePaymentConfirmation = async (paymentId: string, confirmado: boolean): Promise<Payment> => {
    const fecha_pago = confirmado ? new Date().toISOString() : null;
    const { data, error } = await supabase
        .from('payments')
        .update({ confirmado, fecha_pago })
        .eq('id', paymentId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
    const { data, error } = await supabase.from('payments').insert([payment]).select().single();
    if (error) throw error;
    return data;
};

export const getConfig = async (): Promise<Config> => {
    const { data, error } = await supabase.from('config').select('*').single();
    if (error) {
        // If no config, return default (or create it)
        return { cuota_mensual: 20, plantilla_dia_15: '', plantilla_dia_30: '', meta_resort: 1000 };
    }
    return {
        ...data,
        meta_resort: data.meta_resort ?? 1000
    };
};

export const updateConfig = async (config: Config): Promise<Config> => {
    const { data: currentData, error: fetchError } = await supabase.from('config').select('*').single();

    // Attempt update
    const { data, error } = await supabase
        .from('config')
        .update(config)
        .eq('id', 1)
        .select()
        .single();

    if (error) {
        if (error.message.includes("meta_resort")) {
            console.warn("La columna 'meta_resort' no existe en la DB. Guardando el resto...");
            const { meta_resort, ...handledConfig } = config;
            const { data: retryData, error: retryError } = await supabase
                .from('config')
                .update(handledConfig)
                .eq('id', 1)
                .select()
                .single();
            if (retryError) throw retryError;
            return { ...retryData, meta_resort: config.meta_resort };
        }
        throw error;
    }
    return data;
};

export const getExpenses = async (): Promise<Expense[]> => {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) throw error;
    return data || [];
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const { data, error } = await supabase.from('expenses').insert([expense]).select().single();
    if (error) throw error;
    return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
};

export const getEventPhotos = async (): Promise<EventPhoto[]> => {
    const { data, error } = await supabase.from('event_photos').select('*');
    if (error) throw error;
    return data || [];
};

export const addEventPhoto = async (photo: Omit<EventPhoto, 'id'>): Promise<EventPhoto> => {
    const { data, error } = await supabase.from('event_photos').insert([photo]).select().single();
    if (error) throw error;
    return data;
};
