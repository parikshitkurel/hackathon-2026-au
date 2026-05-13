// This file contains authorized judges for the Hackathon Portal.
// NOTE: For a production environment, consider moving this to a database table or using environment variables.

export const AUTHORIZED_JUDGES = [
  { 
    email: "admin@avantika.edu.in", 
    password: "Admin@Avantika", 
    name: "System Administrator", 
    id: "admin-001",
    role: "admin",
    active: true
  },
  { 
    email: "judge1@avantika.edu.in", 
    password: process.env.NEXT_PUBLIC_JUDGE1_PASSWORD || "Hack@Judge1", 
    name: "Judge 1", 
    id: "00000000-0000-0000-0000-000000000001",
    role: "judge",
    active: true
  },
  { 
    email: "judge2@avantika.edu.in", 
    password: process.env.NEXT_PUBLIC_JUDGE2_PASSWORD || "AvantikaXHack", 
    name: "Judge 2", 
    id: "00000000-0000-0000-0000-000000000002",
    role: "judge",
    active: true
  },
  { 
    email: "judge3@avantika.edu.in", 
    password: process.env.NEXT_PUBLIC_JUDGE3_PASSWORD || "Avantika@#2026", 
    name: "Judge 3", 
    id: "00000000-0000-0000-0000-000000000003",
    role: "judge",
    active: true
  },
];
