// ✅ FIXED CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://thebluexx.com',
    'https://www.thebluexx.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));