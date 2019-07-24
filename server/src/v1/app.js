import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send(`Welcome to Property Pro Lite!
Created by Jacqueline Binya`));

const port = process.env.PORT || 8001;


app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
