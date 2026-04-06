import { db } from './firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  // 1. Lojas de Exemplo
  const stores = [
    {
      id: 'store_1',
      name: 'Mercado Central',
      cnpj: '22.866.019/0001-58',
      razaoSocial: 'Mercado Central LTDA',
      phone: '(98) 98888-7777',
      cashbackPct: 5,
      status: 'approved',
      ownerUid: 'merchant_1_uid',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'store_2',
      name: 'Farmácia Araújo',
      cnpj: '99.551.500/0001-62',
      razaoSocial: 'Drogaria Araujo S.A.',
      phone: '(98) 97777-6666',
      cashbackPct: 7,
      status: 'approved',
      ownerUid: 'merchant_2_uid',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'store_3',
      name: 'Posto Ipiranga',
      cnpj: '11.222.333/0001-44',
      razaoSocial: 'Combustíveis Ipiranga',
      phone: '(98) 96666-5555',
      cashbackPct: 3,
      status: 'approved',
      ownerUid: 'merchant_3_uid',
      createdAt: new Date().toISOString(),
    }
  ];

  stores.forEach(store => {
    const ref = doc(db, 'stores', store.id);
    batch.set(ref, store);
  });

  // 2. Clientes de Exemplo
  const clients = [
    {
      uid: 'client_1_uid',
      displayName: 'Maria Silva',
      email: 'maria@example.com',
      role: 'client',
      level: 'prata',
      availableCashback: 45.50,
      totalCashback: 120.00,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'client_2_uid',
      displayName: 'João Pereira',
      email: 'joao@example.com',
      role: 'client',
      level: 'bronze',
      availableCashback: 12.30,
      totalCashback: 12.30,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
  ];

  clients.forEach(client => {
    const ref = doc(db, 'users', client.uid);
    batch.set(ref, client);
  });

  // 3. Notas Fiscais de Exemplo
  const invoices = [
    {
      id: 'inv_1',
      accessKey: '21260322866019000158550010000012341234567890',
      value: 200.00,
      cashbackAmount: 10.00,
      clientUid: 'client_1_uid',
      storeId: 'store_1',
      status: 'approved',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'inv_2',
      accessKey: '21260499551500000162550010000056785678901234',
      value: 145.00,
      cashbackAmount: 10.15,
      clientUid: 'client_2_uid',
      storeId: 'store_2',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  ];

  invoices.forEach(inv => {
    const ref = doc(db, 'invoices', inv.id);
    batch.set(ref, inv);
  });

  await batch.commit();
  console.log('Database seeded successfully!');
};
