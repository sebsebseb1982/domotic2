import * as express from 'express';
import {TorrentDB} from "./db";
import {ITorrent} from "./models/torrent";
import {InsertOneWriteOpResult} from "mongodb";
import {Torrents2RSS} from "./rss";

//class App {
export class App {

    public express: express.Application;
    torrentDB: TorrentDB;

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
                this.torrentDB.getLastTorrents().then((torrents: ITorrent[]) => {
                    res.set('Content-Type', 'text/xml');
                    let torrents2RSS = new Torrents2RSS();
                    res.send(torrents2RSS.getRSSFeedFromTorrents(torrents));
                });
            })
            .post('/torrents', (req, res, next) => {
                let torrent: ITorrent = {
                    url: 'url',
                    source: 'source',
                    date: new Date()
                };
                this.torrentDB.addTorrent(torrent).then((result:InsertOneWriteOpResult) => {
                    res.json(result);
                });
            });

        this.express.use('/', router);
    }

}

//export default new App().express;
