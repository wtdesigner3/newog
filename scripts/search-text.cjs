const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const uri = 'mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority';
async function run() {
  await mongoose.connect(uri);
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const c of collections) {
    const docs = await mongoose.connection.db.collection(c.name).find({
      $or: [
        { title: { $regex: 'institutional', $options: 'i' } },
        { content: { $regex: 'institutional', $options: 'i' } },
        { subtitle: { $regex: 'institutional', $options: 'i' } },
        { description: { $regex: 'institutional', $options: 'i' } }
      ]
    }).toArray();
    if (docs.length > 0) {
      console.log('Found in', c.name, docs);
    }
  }
  console.log('Search complete.');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });

