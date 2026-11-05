const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const uri = 'mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority';

async function seed() {
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('ctas');
  await col.deleteMany({});
  const result = await col.insertOne({
    badge: 'MEP & HVAC ENGINEERING SUPPORT',
    title: 'Require custom institutional HVAC specifications?',
    content: 'Our engineering desk assists MEP consultants, architects, and facilities managers with heat load calculations, static pressure sizing, and duct equipment layouts.',
    buttonText: 'Consult Engineering Desk',
    buttonUrl: '/contact-us',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('Seeded Cta (Engineering Callout):', result.insertedId);
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});

