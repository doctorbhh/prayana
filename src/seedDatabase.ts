import { db } from '@/config/firebase-seed';
import { ref, set } from 'firebase/database';

const seedDatabase = async () => {
  try {
    // Seed locations (total 6 locations)
    await set(ref(db, 'locations/location1'), {
      id: 'location1',
      name: 'Central Block',
      lat: 16.494812,
      lng: 80.499074
    });
    await set(ref(db, 'locations/location2'), {
        id: 'location2', 
        name: 'AB-1', 
        lat: 16.495239, 
        lng: 80.500849
    });
    await set(ref(db, 'locations/location3'), {
        id: 'location3', 
        name: 'AB-2', 
        lat: 16.495679, 
        lng: 80.498451
    });
    await set(ref(db, 'locations/location4'), {
        id: 'location4', 
        name: 'FOOD-STREET', 
        lat: 16.493725, 
        lng: 80.498484
    });
    await set(ref(db, 'locations/location5'), {
        id: 'location5', 
        name: 'Student Activity Centre (SAC)', 
        lat: 16.494686, 
        lng: 80.498317
    });
    await set(ref(db, 'locations/location6'), {
        id: 'location6', 
        name: 'MAIN ENTRANCE', 
        lat: 16.496720, 
        lng: 80.49918
    });

    // Seed bikes for location1 (Downtown)
    await set(ref(db, 'bikes/bike1'), {
      id: 'bike1',
      location: 'location1',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike2'), {
      id: 'bike2',
      location: 'location1',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike3'), {
      id: 'bike3',
      location: 'location1',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });

    // Seed bikes for location2 (Uptown)
    await set(ref(db, 'bikes/bike4'), {
      id: 'bike4',
      location: 'location2',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike5'), {
      id: 'bike5',
      location: 'location2',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike6'), {
      id: 'bike6',
      location: 'location2',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });

    // Seed bikes for location3 (Midtown)
    await set(ref(db, 'bikes/bike7'), {
      id: 'bike7',
      location: 'location3',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike8'), {
      id: 'bike8',
      location: 'location3',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike9'), {
      id: 'bike9',
      location: 'location3',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });

    // Seed bikes for location4 (East Village)
    await set(ref(db, 'bikes/bike10'), {
      id: 'bike10',
      location: 'location4',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike11'), {
      id: 'bike11',
      location: 'location4',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike12'), {
      id: 'bike12',
      location: 'location4',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });

    // Seed bikes for location5 (West Village)
    await set(ref(db, 'bikes/bike13'), {
      id: 'bike13',
      location: 'location5',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike14'), {
      id: 'bike14',
      location: 'location5',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike15'), {
      id: 'bike15',
      location: 'location5',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });

    // Seed bikes for location6 (Brooklyn Heights)
    await set(ref(db, 'bikes/bike16'), {
      id: 'bike16',
      location: 'location6',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike17'), {
      id: 'bike17',
      location: 'location6',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });
    await set(ref(db, 'bikes/bike18'), {
      id: 'bike18',
      location: 'location6',
      status: 'available',
      lastUsed: '2025-04-26T00:00:00Z'
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log("Seeding process completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });