import {ITorrent} from "./models/torrent";

export class Torrents2RSS {

    getRSSFeedFromTorrents(torrents: ITorrent[]): string {

        let items = '';

        torrents.forEach((torrent) => {
           items += `<item>
                        <title>${torrent.source}</title>
                        <description>Added on ${torrent.date}</description>
                        <guid> e380a6c5ae0fb15f296d29964a56250780b05ad7 </guid>
                        <enclosure url="${torrent.url}" type="application/x-bittorrent" />
                    </item>`;
        });

        return `<?xml version="1.0" encoding="utf-8"?>
                <rss version="2.0">
                    <channel>
                        <title> Featured content </title>
                        ${items}
                    </channel>
                </rss>`;
    }

}