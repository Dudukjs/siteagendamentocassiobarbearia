export interface Service {
    id: string;
    name: string;
    price: number;
    duration: number; // in minutes
}

export const SERVICES: Service[] = [
    { id: '1', name: 'Corte Social/Infantil/Tesoura/Militar', price: 20, duration: 30 },
    { id: '2', name: 'Corte Degradê/Low Fade/Americano', price: 23, duration: 40 },
    { id: '3', name: 'Degradê Navalhado', price: 30, duration: 40 },
    { id: '4', name: 'Barba', price: 15, duration: 30 },
    { id: '5', name: 'Combo (Corte+Barba)', price: 40, duration: 60 },
    { id: '6', name: 'Sobrancelha', price: 5, duration: 15 },
];

export const BARBERSHOP_PHONE = '558799846754';
export const OPENING_HOURS = {
    saturday: { start: 8, end: 18 },
    sunday: { start: 9, end: 16 },
};
