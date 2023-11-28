import express from 'express';
import routes from './routes/routes.js';
import dbController from './db/dbController.js'

const PORT = 5000;
const app = express();
const dataBase = new dbController();

app.use(express.json());
app.use('/', routes);

async function startApp() {
    try {
        app.listen(PORT, () => console.log(`listening port ${PORT}`));
    } catch (err) {
        console.log(err);
    }
}

startApp();

export default dataBase;