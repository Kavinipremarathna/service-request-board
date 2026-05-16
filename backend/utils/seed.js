require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const JobRequest = require('../models/JobRequest');

const sampleJobs = [
  {
    title: 'Leaking kitchen tap needs urgent repair',
    description: 'My kitchen tap has been dripping for two weeks. The leak is getting worse and I am worried about water damage under the sink. Need someone experienced with mixer taps.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah.mitchell@example.com',
    status: 'Open',
  },
  {
    title: 'Full bathroom rewire required',
    description: 'Planning a bathroom renovation and need all electrical work done to Part P compliance. Includes new extractor fan, shaver socket, and downlights. Must be NICEIC registered.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'James Cooper',
    contactEmail: 'j.cooper@example.com',
    status: 'Open',
  },
  {
    title: 'Interior painting — 3-bedroom flat',
    description: 'Need the entire flat repainted before new tenants move in. Walls and ceilings throughout. Good quality emulsion paint provided. Access available from Monday.',
    category: 'Painting',
    location: 'Manchester',
    contactName: 'Priya Sharma',
    contactEmail: 'priya.s@example.com',
    status: 'In Progress',
  },
  {
    title: 'Garden decking installation',
    description: 'Want composite decking fitted in the rear garden. Approx 20sqm area. Would like raised platform with a small set of steps down to the lawn. Quotes welcome.',
    category: 'Joinery',
    location: 'Bristol',
    contactName: 'Tom Hargreaves',
    contactEmail: 'tomh@example.com',
    status: 'Open',
  },
  {
    title: 'Flat roof repair after storm damage',
    description: 'Storm last week lifted a section of felt on my garage flat roof. Water coming in during rain. Need someone to inspect and carry out lasting repair or replacement.',
    category: 'Roofing',
    location: 'Leeds',
    contactName: 'Karen Osei',
    contactEmail: 'karen.osei@example.com',
    status: 'Open',
  },
  {
    title: 'Laminate flooring in living room and hallway',
    description: 'Currently have carpet throughout ground floor. Want laminate or LVT laid in living room (approx 25sqm) and hallway (approx 8sqm). Happy to discuss product options.',
    category: 'Flooring',
    location: 'Birmingham',
    contactName: 'Daniel Walsh',
    contactEmail: 'dan.walsh@example.com',
    status: 'Closed',
  },
  {
    title: 'Overgrown back garden clearance',
    description: 'Back garden has not been touched in two years. Large overgrown hedges, weeds everywhere, and two old sheds to be demolished and cleared. Skip hire arranged.',
    category: 'Gardening',
    location: 'Nottingham',
    contactName: 'Fiona Campbell',
    contactEmail: 'fiona.c@example.com',
    status: 'Open',
  },
  {
    title: 'End-of-tenancy deep clean required',
    description: 'Moving out of a 2-bed house and need a professional end-of-tenancy clean to get deposit back. Oven, bathrooms, carpets, and windows all need attention. Flexible on date this week.',
    category: 'Cleaning',
    location: 'Liverpool',
    contactName: 'Amir Hassan',
    contactEmail: 'amir.h@example.com',
    status: 'Open',
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await JobRequest.deleteMany({});
    console.log('🗑️  Existing records cleared');

    const created = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱 Successfully seeded ${created.length} job requests`);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDB();
