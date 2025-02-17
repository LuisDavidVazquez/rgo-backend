import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  apiBaseUrl: process.env.API_BASE_URL || 'https://development-qasar-alb-1822586593.us-east-2.elb.amazonaws.com:5006',

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001',
};

