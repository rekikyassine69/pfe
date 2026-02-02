export const users = [
  { id: '1', name: 'Marie Dupont', email: 'marie.dupont@email.com', phone: '+33 6 12 34 56 78', role: 'client', status: 'active' },
  { id: '2', name: 'Jean Martin', email: 'jean.martin@email.com', phone: '+33 6 23 45 67 89', role: 'client', status: 'active' },
  { id: '3', name: 'Pierre Durand', email: 'pierre.durand@email.com', phone: '+33 6 45 67 89 01', role: 'admin', status: 'active' },
];

export const pots = [
  {
    id: '1',
    name: 'Tomate Cerise',
    plant: 'Solanum lycopersicum',
    status: 'healthy',
    humidity: 68,
    temperature: 24,
    light: 7.5,
    airQuality: 95,
    lastWatered: '2024-12-01T08:00:00Z',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
    ownerId: '1',
  },
  {
    id: '2',
    name: 'Basilic',
    plant: 'Ocimum basilicum',
    status: 'healthy',
    humidity: 72,
    temperature: 22,
    light: 6.8,
    airQuality: 92,
    lastWatered: '2024-12-02T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400',
    ownerId: '1',
  },
];