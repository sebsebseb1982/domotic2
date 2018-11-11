#!/usr/bin/env node

/*
"use strict"

let _ = require('lodash');
let cheerio = require('cheerio');
let crypto = require('crypto');
let request = require('request');
let log = require('../nma/log.js');


module.exports = {
	crawlerRecherche : (recherche, callback) => {
		console.log(`Crawl "${recherche.name}"`)
		request(recherche.url, function (error, response, html) {
			
			let items = [];
			
			if (!error && response.statusCode == 200) {
				let $ = cheerio.load(html);
				
				let domElements = $('a.clearfix.trackable');
				
				_.forEach(domElements, (domElement) => {
					let item = createItemFromDOMElement(domElement, $, recherche);
					items.push(item);
				});
				
				callback(items);
				
			} else {
				log.erreur('Erreur lors du crawl de la recherche ' + recherche.name, error);
			}
		});
	}
};

let calculerHashItem = (item) => {
	let md5sum = crypto.createHash('md5');
	md5sum
		.update(item.name)
		/!*.update(item.category)*!/
		/!*.update(item.place)*!/
		.update(item.price);
		
	_.forEach(item.recherche.recipients, (aRecipient) => {
		md5sum.update(aRecipient);
	});	
		
	return md5sum.digest('hex');
};

let createItemFromDOMElement = (domElement, $, recherche) => {
	// https://img7.leboncoin.fr/ad-thumb/3c7683f286bc49420cc6a2be1e565473c13d8495.jpg
	// https://img7.leboncoin.fr/ad-image/3c7683f286bc49420cc6a2be1e565473c13d8495.jpg
	
	
	console.log($(domElement).html());
	
	_.forEach($(domElement).find('img[itemprop=image]'), (anImg) => {
		console.log(anImg.attr('src'));
	});	
	
	let imgUrl = $(domElement).find('img[itemprop=image]').attr('src');
	if(imgUrl) {
		imgUrl = imgUrl.replace(/thumb/g, 'image');
	}
	let now = new Date();
	
	let crawledPrice = _.trim($(domElement).find('section.item_infos h3.item_price').text()).match(/[0-9\s]*€/g);
	let price = crawledPrice === null ? "Prix non précisé" : crawledPrice[0];
		
	let item = {
		/!*"professional" : $(domElement).find('span[]').length > 0,*!/
		"name" : _.trim($(domElement).find('span[itemprop=name]').text()),
		"url" : 'https://www.leboncoin.fr' + $(domElement).attr('href'),
		"imgUrl" : imgUrl,
		"price" : price,
		//"date" : _.trim($($(domElement).find('section.item_infos .item_supp')[2]).text()),
		"date" : now.getDate() + '/' + (now.getMonth() + 1) + '/' +  now.getFullYear(),
		"category" : _.trim($($(domElement).find('section.item_infos .item_supp')[0]).text()),
		"place" : _.trim($($(domElement).find('section.item_infos .item_supp')[1]).text()).replace(/\s+/g, " "),
		"recherche" : recherche
	};
	
	item.hash = calculerHashItem(item);
	
	return item;
};

*/
