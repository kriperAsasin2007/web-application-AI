const allowedOrigins = [process.env.FRONTEND_URL];

export const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
