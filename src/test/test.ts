import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/scrapers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";
import {GenericMeteoScraper} from "../meteo/scrapers/generic";

let googleHome = new GoogleHomeService();

/*
new LaChaineMeteo('http://france.lachainemeteo.com/meteo-france/ville/previsions-meteo-talence-5432-0.php').meteoDuJour.then((meteo:IMeteo) => {
    googleHome.speak(meteo.texte);
});
*/

/*
new GenericMeteoScraper({
    url: 'http://www.meteocity.com/france/talence_v33522/',
    selecteurCSS: '.dataDescription span:not(.linkHeureparheure)',
    encoding: 'utf8'
}).meteoDuJour.then((meteo:IMeteo) => {
    googleHome.speak(meteo.texte);
});
*/

let jingles = [
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Seseragi.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SF-1.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Gota%20del%20Vient.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH-2.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH-3.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Bell%20B.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Haru.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Melody.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Tetsuwan%20Atom%20B.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Aratana%20Kisetsu.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Harajuku%20a.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Hana%20no%20Horokobi.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH-1.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Cielo%20Estrellado.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SF-3.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/dance%20on.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Harajuku%20b.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Ogawa%20no%20Seseragi.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/twilight.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Bell%20A.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Tetsuwan%20Atom%20A.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Spring%20Box.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Umi%20no%20Eki.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH2-1.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH5.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Verde%20Ray.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SF10-60.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kumo%20wo%20Tomo%20Toshite.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Tetsudou%20Shouka.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH3-1.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/farewell.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/mellow%20time.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kairo%20no%20Jikan.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Tooi%20Aozora.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/see%20you%20again.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Utsukushiki%20Tsukasa.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kaigan%20Doori.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Susuki%20no%20Kougen.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kigi%20no%20Mezame.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Ogawa%20no%20Seseragi%20V1.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/airly.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/twilight.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Cielo%20Estrellado.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH5-2.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH6.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Seiryuu.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kamata%20Koshin%20Kyoku%201.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kamata%20Koshin%20Kyoku%202.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Water%20Crown.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SF10-60.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Verde%20Rayo.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH4-1.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Asa%20no%20Shizukesa.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Holiday.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SH5-2.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Cappuccino.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Himitsu%20no%20Akko-chan.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/huh%20[unnamed%20may%20have%20fallen%20out%20of%20order!].mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/JR-SH9.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/huh%20[2%20of%204%20titles%20listed].mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Senro%20no%20Kanata.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Hana%20to%20Sora.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/sunrise.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Aozora%20no%20Shita.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kagayaku%20Machinami.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Coral%20Reef.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Akizakura.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kaigan%20Doori%20V1%20[no%20difference].mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kigi%20no%20Mezame%20V1%20[one%20of%20these%20is%20V2!].mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Holiday%20V1.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Furui%20Orgol.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SF10-31%20[supposedly].mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SF22-14.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/SF22-29.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Kurumi%20Asobi.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/sunny%20islands.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Tetsuwan%20Atom%20C.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/Tetsuwan%20Atom%20D.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR1-Shanai%20Housou%20Ongaku.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR2-Shanai%20Housou%20Ongaku.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR3-Shanai%20Housou%20Ongaku.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR4-Tetsudou%20Shouka.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR5-Haru%20no%20Uta.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR6-Haru.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR10-Vienna%20no%20Mori%20no%20Monogatari.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR9-Kirakira%20Hoshi.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR14-Shanai%20Housou%20Ongaku.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR1-Shu%20Yo,%20Hito%20no%20Nozomi%20no%20Yorokobi%20Yo.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR8-Utsukushiku%20Aoki%20Donau.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR11-Shanai%20Housou%20Ongaku.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/TR12-Shanai%20Housou%20Ongaku.mp3',
    'http://sebastienblondy.com/JR%20Train%20Departure%20Melodies%20MP3/eau%20conrante～tsuru～.mp3'
];

googleHome.play(jingles[Math.floor(Math.random() * jingles.length)]);