/**
 * Created by diogo on 08/05/17.
 */

import * as express from "express";
import {Router} from "express";
import * as bodyParser from "body-parser";

export class ExpressServer {

    private application: express.Application;

    constructor(){
        this.application = express();
        this.middlewares();
    }

    public registerRoute(route: string, router: Router){
        this.application.use(route, router);
        return this;
    }

    public async listen(){
        await this.application.listen(3000, () => {console.log("Up!")});
    }

    private middlewares() {
        this.application.use(bodyParser.urlencoded({extended: true}));
        this.application.use(bodyParser.json());
    }
}