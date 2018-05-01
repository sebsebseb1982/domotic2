const GoogleHome = require('node-googlehome')
 
 
/**
 * connect google home with IP.
 * @param {ip_address: string}
 */
let device = new GoogleHome.Connecter('192.168.1.203') 
/**
 * setting language
 * @param {{lang: string(default: 'en')}}
 */
device.config({lang: 'fr'})
 
 
/**
 * Start speaker.
 * If you do this, google home will immediately sound when you call speak() or playMedia()
 */
device.readySpeaker()
  .then(() => {

/**
 * google home speak!
 * @param {message: string, speed: number(default:1), timeout: number(default: 3000)}
 */
device.speak('coucou')
  .then(console.log)
  .catch(console.log)
 

})
 
/*device.playMedia('http://www.hypertrombones.jp/sample/system7.mp3')
  .then(console.log)
  .catch(console.log)*/
