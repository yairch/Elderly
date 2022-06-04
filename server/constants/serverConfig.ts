import path from 'path';
import dotenv from 'dotenv';

enum ENVIRONMENT_MODES {
    DEV='development',
    PROD='production'
};

export const DEV = process.env.NODE_ENV === ENVIRONMENT_MODES.DEV;

if(DEV) {
    dotenv.config({path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`)});
} else {
    dotenv.config();
}

export const port = process.env.PORT || (DEV ? 80 : 443);