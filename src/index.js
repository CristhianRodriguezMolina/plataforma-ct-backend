import dotenv from 'dotenv/config';
import "@babel/polyfill";

import app from './app';
import './database';
 
const main = () => {
    app.listen(app.get('port'));
    console.log('Server listen on port', app.get('port'));
}

main();