/**
 * Created by diogo on 08/05/17.
 */
import {Request, Response, Router} from "express";
import {LintService} from "../service/lint-service";

export class DockerlintController {

    private router: Router;
    private service: LintService;

    constructor(){
        this.router = Router();
        this.service = new LintService();

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
                    const result = await this.service.lint(dockerFile.dockerFile);
                    res.status(200).send({'error': result.status.failed, 'result': result});
                }
            } else {
                res.status(406).send({'error': true, 'message': 'No body provided'});
            }

        });
    }
}