import * as express from 'express';
import {TorrentDB} from "./db";
import {ITorrent} from "./models/torrent";

class App {

    public express: express.Application;
    torrentDB:TorrentDB;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.torrentDB = new TorrentDB();
    }

    private middleware(): void {
    }

    private routes(): void {
        let router = express.Router();
        router
            .get('/torrents', (req, res, next) => {
                this.torrentDB.getLastTorrents().then((torrents:ITorrent[]) => {
                    res.json(torrents);
                });
            })
            .post('/torrents', (req, res, next) => {
                let torrent = new ITorrent();
                torrent.url = 'url';
                torrent.source = 'source';
                this.torrentDB.addTorrent(torrent);
            });

        this.express.use('/', router);
    }

}

export default new App().express;
