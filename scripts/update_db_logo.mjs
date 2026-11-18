import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
const res = await db.collection('globalsettings').updateOne(
  {},
  { $set: { logoImage: '/images/og-logo-black-readable-2x.png' } }
);
console.log('MongoDB update result:', res);
await mongoose.disconnect();
