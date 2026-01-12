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
        return { cuota_mensual: 20, plantilla_dia_15: '', plantilla_dia_30: '' };
    }
    return data;
};

export const updateConfig = async (config: Config): Promise<Config> => {
    const { data, error } = await supabase
        .from('config')
        .update(config)
        .eq('id', 1) // Assuming singleton with ID 1
        .select()
        .single();
    if (error) throw error;
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
