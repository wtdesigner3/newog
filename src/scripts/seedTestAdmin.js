import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Production safety check: Abort immediately in production environments
if (process.env.NODE_ENV === 'production') {
  console.error("CRITICAL SECURITY ERROR: Administrative seed script cannot be executed in production environment.");
  process.exit(1);
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/ogheavyduty_dev';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: null },
    permissions: {
      type: Map,
      of: [String],
      default: {},
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockUntil: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
  console.log('Connecting to MongoDB at:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });

  const existingAdmin = await User.findOne({
    $or: [{ username: 'admin' }, { email: 'admin@ogheavyduty.in' }],
  });

  if (existingAdmin) {
    console.log(`Development administrator already exists: ${existingAdmin.email} (${existingAdmin.username})`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@12345', 12);

  const admin = new User({
    name: 'OG Heavy Duty Administrator',
    username: 'admin',
    email: 'admin@ogheavyduty.in',
    password: hashedPassword,
    role: 'super_admin',
    isActive: true,
    tokenVersion: 0,
    failedLoginAttempts: 0,
    isLocked: false,
  });

  await admin.save();
  console.log('Successfully seeded development super administrator:');
  console.log('Username: admin');
  console.log('Email:    admin@ogheavyduty.in');
  console.log('Role:     super_admin');
  console.log('Password has been securely hashed with bcrypt (rounds: 12).');

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('Failed to seed administrator:', err);
  process.exit(1);
});
