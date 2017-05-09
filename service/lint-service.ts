/**
 * Created by diogo on 08/05/17.
 */

import * as b64 from "base64-js";
import * as fs from "fs";
import * as uuid from "uuid/v4";
import * as utils from "dockerlint/lib/utils";
import * as cli from "dockerlint/lib/cli";

/**
      || __   ||
      ||=\_`\=||
      || (__/ ||
      ||  | | :-"""-.
      ||==| \/-=-.   \
      ||  |(_|o o/   |_
      ||   \/ "  \   ,_)
      ||====\ ^  /__/
      ||     ;--'  `-.
      ||    /      .  \
      ||===;        \  \
      ||   |         | |
      || .-\ '     _/_/
      |:'  _;.    (_  \
      /  .'  `;\   \\_/
     |_ /     |||  |\\
    /  _)=====|||  | ||
   /  /|      ||/  / //
   \_/||      ( `-/ ||
      ||======/  /  \\ .-.
  jgs ||      \_/    \'-'/
      ||      ||      `"`
      ||======||
      ||      ||
 */
export class LintService{

    /**
     * Receives a Base64 Dockerfile, returning an array of errors found.
     *
     * @param dockerFile
     * @returns {Promise<any>}
     */
    public async lint(dockerFile: string){

        const fileName = `/tmp/${uuid()}`;

        await this.writeFile(dockerFile, fileName);
        this.patchDockerlintUtils(fileName);
        this.patchDockerlintLog();

        const result = this.checkDockerfile();

        await fs.unlink(fileName);

        return result;
    }

    /**
     * Patching temp file name to args.
     *
     * @param fileName Temporary Dockerfile generated.
     */
    private patchDockerlintUtils(fileName: string){
        utils.failures = [];

        const fnRun = cli.run;

        cli.run = function (args) {
            args.file = fileName;
            fnRun.apply(this, arguments);
        }
    }

    /**
     * Patching log method looking for errors.
     */
    private patchDockerlintLog(){
        utils.log = function (level, message) {
            this.failures.push({'level': level, 'message': message});
        };
    }

    private async writeFile(dockerFile: string, fileName: string) {
        const dockerFileText = await this.fromBase64(dockerFile);
        fs.writeFileSync(fileName, dockerFileText, "utf8");
    }

    private async fromBase64(dockerFile: string) {
        return new Buffer(b64.toByteArray(dockerFile)).toString();
    }

    private checkDockerfile() {
        try{
            require("dockerlint");
        } catch(e){
            console.log(e);
        }

        return utils.failures;
    }
}