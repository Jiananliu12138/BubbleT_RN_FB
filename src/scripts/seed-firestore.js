// scripts/seed-firestore.js
// This script helps you populate your Firestore database with sample bubble tea data

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../services/firebaseConfig.js';
import bubbleTeaData from './sample-data.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Create a batch of operations to perform atomically
    for (const tea of bubbleTeaData) {
      console.log(`Adding tea: ${tea.name}`);
      
      // Use the predefined ID from the sample data
      await setDoc(doc(db, 'bubbleTeas', tea.id), tea);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();

/*
To run this script:
1. Save it as a .js file in a scripts folder
2. Make sure your firebaseConfig.js is properly set up
3. Install the dependencies: npm install firebase
4. Run with Node.js: node seed-firestore.js
*/