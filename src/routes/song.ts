import express from 'express';


const singRouter = express.Router();
singRouter.use(express.json());


singRouter.post('/save', (req, res) => {

});

export default singRouter;