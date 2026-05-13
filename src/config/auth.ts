// This file contains authorized accounts for the Hackathon Portal.
// Separated into Admins and Judges for clarity.

export const ADMIN_ACCOUNTS = [
  { 
    email: "admin@avantika.edu.in", 
    password: "Admin@Avantika", 
    name: "System Administrator", 
    id: "admin-001",
    role: "admin",
    active: true
  }
] as const;

export const JUDGE_ACCOUNTS = [
  { 
    email: "judge1@avantika.edu.in", 
    password: "Hack@Judge1", 
    name: "Judge 1", 
    id: "judge-001",
    role: "judge",
    active: true
  },
  { 
    email: "judge2@avantika.edu.in", 
    password: "AvantikaXHack", 
    name: "Judge 2", 
    id: "judge-002",
    role: "judge",
    active: true
  },
  { 
    email: "judge3@avantika.edu.in", 
    password: "Avantika@#2026", 
    name: "Judge 3", 
    id: "judge-003",
    role: "judge",
    active: true
  }
] as const;

export const AUTHORIZED_USERS = [...ADMIN_ACCOUNTS, ...JUDGE_ACCOUNTS];
