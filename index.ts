import {ExpressServer} from "./infra/express-server";
import {register} from "ts-node/dist";
import {DockerlintController} from "./controller/lint-controller";
/**
 * Created by diogo on 08/05/17.
 */

new ExpressServer()
    .registerRoute("/lint", new DockerlintController().getRoutes())
    .listen();