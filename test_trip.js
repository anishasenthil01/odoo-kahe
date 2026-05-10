import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const token = jwt.sign({ id: 1, role: 'user' }, process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production', { expiresIn: '1h' });

async function test() {
  try {
    const res = await fetch('http://127.0.0.1:5005/api/trips', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Trip',
        start_date: '2026-06-01',
        end_date: '2026-06-10'
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
