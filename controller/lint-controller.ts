/**
 * Created by diogo on 08/05/17.
 */
import {Application, Request, Response} from "express";

class DockerlintController {

    private express: Application;

    constructor(express: Application){
        this.express = express;

        this.registerLintAction();
    }

    private registerLintAction() {
        this.express.post('/lint', async (req: Request, res: Response) => {
            const body = req.body.dockerFile;

            if(!body){
                res.status(400).send({'error': true, 'message': 'Invalid/empty Dockerfile provided'});
            } else {
                res.status(200).send({'error': false, 'message': 'Zero errors =D'});
            }

        });
    }
}