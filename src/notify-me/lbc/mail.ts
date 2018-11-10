#!/usr/bin/env node

"use strict"

let _ = require('lodash');
let db = require('./db.ts');
let notifyMyAndroid = require('../nma/nma.js');
let nodemailer = require('nodemailer');
let mustache = require('mustache');
let fs = require('fs');
let secret = require('../secret.js');

let preparerNotification = (item) => {
	return {
		'application' : 'Alertes LBC',
		'event' : item.name,
		'description' : item.price === undefined ? 'prix non spécifié' : item.price,
		'url' : item.url,
		'priority' : 1
	};
};

let sortItemsByRecipients = (items) => {
	let itemsByRecipient = [];
	
	_.forEach(items, (item) => {
		_.forEach(item.recherche.recipients, (recipient) => {
			let recipientEntry = _.find(itemsByRecipient, _.matchesProperty('recipient', recipient));
			
			if(recipientEntry === undefined) {
				itemsByRecipient.push({
					"recipient" : recipient,
					"items" : [item]
				});
			} else {
				recipientEntry.items.push(item);
			}
		});
	});
	
	return itemsByRecipient;
};

fs.readFile('/home/pi/node/notificationsLBC/template.mail', 'utf-8', function read(err, mailTemplate) {
	
    if (err) {
        throw err;
    }

	console.log('préparation de l\'envoi');
	
	db.listerItems((items) => {
	
	
	
		_.forEach(items, (item) => {
			notifyMyAndroid.send(preparerNotification(item));
			console.log(item.name);
		});
	

	
		let itemsByRecipients = sortItemsByRecipients(items);
		
		_.forEach(itemsByRecipients, (itemsForARecipient) => {			
			console.log('A');
			let mailOptions = {
			   from: 'Notifications LBC <noreply@notifications-lbc.fr>',
			   to: 'Moi <' + itemsForARecipient.recipient + '>',
			   subject: 'Notifications LBC (' + itemsForARecipient.items.length + ') ' + Math.random(),
			   html: mustache.to_html(mailTemplate, {'items': itemsForARecipient.items})
			};
			console.log('B');
			let mailTransport = nodemailer.createTransport(secret.mail.smtps);
			console.log('C');
			mailTransport.sendMail(mailOptions, function(error, info){
				console.log('D');
				if(error){
					console.log('E');
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);
			});

		});
		
		_.forEach(items, (item) => {
			db.marquerNotifie(item);
		});
	});
});