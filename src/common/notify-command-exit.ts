import {spawn} from "child_process";
import {Logger} from "./logger/logger";

module.exports = {
    executeCommand : (command: string) => {
        let commandChunks = command.split(' ');
        let args = commandChunks.length > 1 ? commandChunks.slice(1, commandChunks.length) : [];
        let logger = new Logger(commandChunks[0]);

        logger.debug(JSON.stringify(commandChunks.length > 1));
        logger.debug(JSON.stringify(commandChunks));
        logger.debug(JSON.stringify(args));
        logger.debug(`Lancement de la commande "${commandChunks[0]} ${args.join(' ')}"`);

        const exec = spawn(commandChunks[0], args);

        let errorMessage = '';

        exec.stdout.on('data', (data) => {
            logger.info(data.toString());
        });
        exec.stderr.on('data', (data) => {
            errorMessage += data.toString();
        });
        exec.on('exit', (code) => {
            if (code !== 0) {
                logger.error(`Erreur lors de l\'exécution de la commande ${commandChunks[0]}`, errorMessage);
            }
            logger.info(`Commande "${commandChunks[0]}" finie (code de sortie : ${code})`);
        });
    }
}