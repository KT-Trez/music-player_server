import Logger from '../components/Logger.js';
import {Response} from 'express';


export default class ResponseHandler {
    static handleServerError(res: Response, err: Error, message: string) {
        res.status(500);
        res.end();
        Logger.error(`${message}: ${err.message}.`, 'dhf');
    }
}