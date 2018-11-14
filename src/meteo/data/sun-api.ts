import {Logger} from "../../common/logger/logger";
import * as moment from 'moment';
import {Moment} from 'moment';
import * as request from 'request';
import {RequestOptions} from "http";

interface ISunPhases {
    sunrise: Moment;
    sunset: Moment;
}

export class SunAPI {
    logger: Logger;

    constructor() {
        this.logger = new Logger('Web service soleil');
    }

    get phases(): Promise<ISunPhases> {
        return new Promise<ISunPhases>((resolve, reject) => {
            let options: RequestOptions = {
                protocol: 'http',
                host: 'api.sunrise-sunset.org',
                port: 80,
                path: '/json?lat=44.813632&lng=-0.585443'
            };
            request.get(
                {
                    uri: `${options.protocol}://${options.host}:${options.port}${options.path}`
                },
                (error, response: request.Response) => {
                    if (error || response.statusCode !== 200) {
                        reject(null);
                        this.logger.error(`Impossible de récupérer les heures de lever et de coucher du soleil.`, error);
                    } else {
                        let body = JSON.parse(response.body);
                        resolve({
                            sunrise: moment(body.results.sunrise, 'hh:mm:ss aa'),
                            sunset: moment(body.results.sunset, 'hh:mm:ss aa')
                        });
                    }
                }
            );
        });
    }

    isUp(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.phases.then((sunPhases) => {
                let now = moment();
                resolve(now.isBetween(sunPhases.sunrise, sunPhases.sunset));
            });
        });
    }

    isDown(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.phases.then((sunPhases) => {
                let now = moment();
                resolve(!now.isBetween(sunPhases.sunrise, sunPhases.sunset));
            });
        });
    }
}