import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'qa';

const urls: Record<string, string | undefined> = {
  qa: process.env.QA_BASE_URL,
  dev: process.env.DEV_BASE_URL,
  prod: process.env.PROD_BASE_URL
};

export const config = {
  baseURL: urls[env]
};
