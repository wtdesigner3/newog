const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const uri = 'mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority';

const DEFAULT_TESTIMONIALS = [
  {
    name: "Rajesh Malhotra",
    role: "Managing Director",
    company: "Grand Imperial Banquets, Delhi NCR",
    equipment: "5.0 Ton Heavy-Duty Tower ACs",
    highlight: "14-Hour Continuous 50°C Run",
    stars: 5,
    quote:
      "During the severe 50°C Delhi heatwave in June, ordinary commercial ACs were repeatedly tripping at our banquet facility. OG Heavy Duty’s 5.0 Ton floor-standing tower units ran non-stop for 14 hours daily with zero thermal cutoff. Flawless cooling pull-down.",
    avatar: "",
    sort: 1,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Dr. Arvind Singhal",
    role: "Head of Infrastructure & Facilities",
    company: "Lifeline Super-Speciality Hospital",
    equipment: "4.0 Ton Ceiling Cassette Systems",
    highlight: "24/7 Healthcare Duty Cycle",
    stars: 5,
    quote:
      "Our operation theaters and ICU recovery wards demand 24/7 continuous duty and whisper-quiet laminar airflow. OG Heavy Duty’s 4-way ceiling cassettes with hydrophilic blue fin coils have delivered steady performance without mold buildup or maintenance downtime.",
    avatar: "",
    sort: 2,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Er. Sandeep Verma",
    role: "Chief MEP Project Consultant",
    company: "Northern Apex University Campus",
    equipment: "11.0 Ton Ducted Split Systems",
    highlight: "High Static Pressure Central Ducting",
    stars: 5,
    quote:
      "We retrofitted our 800-seat university auditorium with OG Heavy Duty 11.0 Ton ductable units. The external static pressure handled our custom acoustic ducting with ease, and power draw remained within the calculated specs despite extreme summer heat.",
    avatar: "",
    sort: 3,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pooja Iyer",
    role: "VP of Administration & Infrastructure",
    company: "TechVanguard Corporate Park, Gurugram",
    equipment: "2.0 Ton Inverter Split ACs",
    highlight: "170V Stabilizer-Free Operation",
    stars: 5,
    quote:
      "Energy efficiency and voltage stability were our top selection criteria. Grid voltage drops to 170V during summer peaks in our industrial zone, but OG Heavy Duty's dual rotary inverter split units ran stabilizer-free with zero compressor strain.",
    avatar: "",
    sort: 4,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seed() {
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('testimonials');
  const count = await col.countDocuments();
  if (count === 0) {
    const res = await col.insertMany(DEFAULT_TESTIMONIALS);
    console.log('Seeded testimonials count:', res.insertedCount);
  } else {
    console.log('Testimonials already exist, count:', count);
  }
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });

