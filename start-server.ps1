# start-working.ps1
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   STARTING FORM TRACKER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Kill any existing processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Start backend
Write-Host "Starting backend server..." -ForegroundColor Green
$backendScript = @'
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let forms = [];
let nextUserId = 1;
let nextFormId = 1;

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running!' });
});

app.post('/api/register', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const user = { id: nextUserId++, name, email, phone, password };
    users.push(user);
    res.json({ message: 'Registration successful', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, name: user.name })).toString('base64');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        req.user = JSON.parse(Buffer.from(token, 'base64').toString());
        next();
    } catch(err) { res.status(401).json({ error: 'Invalid token' }); }
};

app.post('/api/forms', auth, (req, res) => {
    const { form_link, description, timeline } = req.body;
    const form = { id: nextFormId++, user_id: req.user.id, form_link, description, timeline, status: 'pending', created_at: new Date().toISOString() };
    forms.push(form);
    res.json({ message: 'Form created', form });
});

app.get('/api/forms', auth, (req, res) => {
    res.json(forms.filter(f => f.user_id === req.user.id));
});

app.put('/api/forms/:id/status', auth, (req, res) => {
    const form = forms.find(f => f.id === parseInt(req.params.id) && f.user_id === req.user.id);
    if (!form) return res.status(404).json({ error: 'Not found' });
    form.status = req.body.status;
    res.json({ message: 'Updated', form });
});

app.delete('/api/forms/:id', auth, (req, res) => {
    const index = forms.findIndex(f => f.id === parseInt(req.params.id) && f.user_id === req.user.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    forms.splice(index, 1);
    res.json({ message: 'Deleted' });
});

app.get('/api/forms/:id/submissions', auth, (req, res) => res.json([]));

app.get('/api/dashboard/stats', auth, (req, res) => {
    const userForms = forms.filter(f => f.user_id === req.user.id);
    res.json({ total: userForms.length, pending: userForms.filter(f => f.status === 'pending').length, completed: userForms.filter(f => f.status === 'completed').length });
});

app.listen(3000, () => console.log('\n🚀 Backend running on http://localhost:3000\n'));
'@

$backendPath = "C:\Users\6dmug\OneDrive\Desktop\form-tracker\backend"
$backendScript | Out-File -FilePath "$backendPath\app-working.js" -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node app-working.js"

Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend server..." -ForegroundColor Green
$frontendPath = "C:\Users\6dmug\OneDrive\Desktop\form-tracker\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'FRONTEND SERVER' -ForegroundColor Cyan; python -m http.server 8000"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ FORM TRACKER IS READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "📍 Open: http://localhost:8000/login.html" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Green

Start-Sleep -Seconds 2
Start-Process "http://localhost:8000/login.html"