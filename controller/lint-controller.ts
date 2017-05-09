/**
 * Created by diogo on 08/05/17.
 */
import {Request, Response, Router} from "express";

export class DockerlintController {

    private router: Router;

    constructor(){
        this.router = Router();

        this.registerLintAction();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private registerLintAction() {
        this.router.post('/', async (req: Request, res: Response) => {

            if(req.body) {
                const dockerFile = req.body;

                if (!dockerFile) {
                    res.status(400).send({'error': true, 'message': 'Invalid/empty Dockerfile provided'});
                } else {
                    res.status(200).send({'error': false, 'message': 'Zero errors =D'});
                }
            } else {
                res.status(406).send({'error': true, 'message': 'No body provided'});
            }

        });
    }
}