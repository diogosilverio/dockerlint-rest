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
        this.patchDockerlintUtils();
        this.patchDockerlintLog();

        const result = this.checkDockerfile(fileName);

        await fs.unlink(fileName);

        return result;
    }

    /**
     * Patching temp file name to args.
     *
     */
    private patchDockerlintUtils(){
        utils.failures = [];
        utils.status = {
            'fatals': 0,
            'errors': 0,
            'warnings': 0,
            'infos': 0
        };
        utils.errorFound = false;
    }

    /**
     * Patching log method looking for errors.
     */
    private patchDockerlintLog(){
        utils.log = function (level, message) {

            switch (level){
                case 'FATAL':{
                    utils.errorFound = true;
                    this.status.fatals += 1;
                    break;
                }
                case 'ERROR':{
                    utils.errorFound = true;
                    this.status.errors += 1;
                    break;
                }
                case 'WARN':{
                    this.status.warnings += 1;
                    break;
                }
                case 'INFO':{
                    this.status.infos += 1;
                    break;
                }
            }

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

    private async checkDockerfile(fileName: string) {
        try{
            const args = {'file': fileName};
            cli.run(args);

        } catch(e){
            console.log(e);
        }

        return {
            'checks': utils.failures,
            'status': {
                'failed': utils.errorFound,
                'message': (utils.errorFound ? "Errors were found." : "No errors found.")
            },
            'frequencies': {
                'info': utils.status.infos,
                'warning': utils.status.warnings,
                'error': utils.status.errors,
                'fatal': utils.status.fatals
            }};
    }

}