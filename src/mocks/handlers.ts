import { rest } from 'msw';
import { users as initialUsers, pots as initialPots } from './data';

let users = [...initialUsers];
let pots = [...initialPots];

export const handlers = [
  // Auth
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
    }
    // naive check: any password accepted
    return res(
      ctx.status(200),
      ctx.json({ token: `token-${user.id}`, user })
    );
  }),

  rest.post('/api/auth/signup', async (req, res, ctx) => {
    const { name, email, password } = await req.json();
    const existing = users.find(u => u.email === email);
    if (existing) return res(ctx.status(400), ctx.json({ message: 'Email exists' }));
    const newUser = { id: Date.now().toString(), name, email, role: 'client', status: 'active' };
    users.push(newUser);
    return res(ctx.status(201), ctx.json({ token: `token-${newUser.id}`, user: newUser }));
  }),

  // Users
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users));
  }),

  rest.post('/api/users', async (req, res, ctx) => {
    const data = await req.json();
    const newUser = { id: Date.now().toString(), ...data };
    users.push(newUser);
    return res(ctx.status(201), ctx.json(newUser));
  }),

  rest.put('/api/users/:id', async (req, res, ctx) => {
    const { id } = req.params as any;
    const updates = await req.json();
    users = users.map(u => u.id === id ? { ...u, ...updates } : u);
    const updated = users.find(u => u.id === id);
    return res(ctx.status(200), ctx.json(updated));
  }),

  rest.delete('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params as any;
    users = users.filter(u => u.id !== id);
    return res(ctx.status(204));
  }),

  // Pots
  rest.get('/api/pots', (req, res, ctx) => {
    const ownerId = req.url.searchParams.get('ownerId');
    const list = ownerId ? pots.filter(p => p.ownerId === ownerId) : pots;
    return res(ctx.status(200), ctx.json(list));
  }),

  rest.post('/api/pots', async (req, res, ctx) => {
    const data = await req.json();
    const newPot = { id: Date.now().toString(), ...data };
    pots.push(newPot);
    return res(ctx.status(201), ctx.json(newPot));
  }),

  rest.put('/api/pots/:id', async (req, res, ctx) => {
    const { id } = req.params as any;
    const updates = await req.json();
    pots = pots.map(p => p.id === id ? { ...p, ...updates } : p);
    const updated = pots.find(p => p.id === id);
    return res(ctx.status(200), ctx.json(updated));
  }),

  rest.delete('/api/pots/:id', (req, res, ctx) => {
    const { id } = req.params as any;
    pots = pots.filter(p => p.id !== id);
    return res(ctx.status(204));
  }),

  // Orders (simple)
  rest.post('/api/orders', async (req, res, ctx) => {
    const data = await req.json();
    const order = { id: Date.now().toString(), ...data, status: 'pending', createdAt: new Date().toISOString() };
    return res(ctx.status(201), ctx.json(order));
  }),
];
