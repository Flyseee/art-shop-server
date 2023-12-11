import express from 'express';
import routes from './routes/routes.js';
import dbController from './db/dbController.js'
import cors from 'cors';

const PORT = 5000;
const app = express();
const dataBase = new dbController();

app.use(express.json());

app.use(cors({
    origin: (origin,func)=>{
        if(!origin||origin === 'https://brullov-shop.neocities.org'){
            func(null,true);
        }else{
            func(new Error('Доступ запрещён'));
        }
    },
    methods: ['GET', 'POST'], 
  }));

app.use('/', routes);

app.listen(PORT, () => console.log(`listening port ${PORT}`));




export default dataBase;