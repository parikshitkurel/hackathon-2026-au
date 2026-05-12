// This file contains authorized judges for the Hackathon Portal.
// NOTE: For a production environment, consider moving this to a database table or using environment variables.

export const AUTHORIZED_JUDGES = [
  { 
    email: "judge1@avantika.edu.in", 
    password: process.env.NEXT_PUBLIC_JUDGE1_PASSWORD || "Hack@Judge1", 
    name: "Judge 1", 
    id: "00000000-0000-0000-0000-000000000001" 
  },
  { 
    email: "judge2@avantika.edu.in", 
    password: process.env.NEXT_PUBLIC_JUDGE2_PASSWORD || "AvantikaXHack", 
    name: "Judge 2", 
    id: "00000000-0000-0000-0000-000000000002" 
  },
  { 
    email: "judge3@avantika.edu.in", 
    password: process.env.NEXT_PUBLIC_JUDGE3_PASSWORD || "Avantika@#2026", 
    name: "Judge 3", 
    id: "00000000-0000-0000-0000-000000000003" 
  },
];
