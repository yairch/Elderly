import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.join(__dirname, '/.env')})

export const devPort = process.env.DEV_PORT || 80;
export const productionPort = process.env.HTTPS_PORT || 443;
export const DEV = process.env.DEV || false;