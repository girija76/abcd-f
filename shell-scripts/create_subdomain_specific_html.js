const fs = require('fs');

const indexHTMLFileName = process.argv[2];
const fileName = process.argv[3];
const destinationFileName = process.argv[4].replace('.js', '');
const sitemapDestinationFileName = process.argv[5].replace('.js', '');
const siteBaseUrl = process.argv[6].replace('.js', '');

const window = {};

const regex = /(?:{{)[a-zA-Z_0-9.]+(?:}})/g;

const createSitemap = sitemapArray => {
	let sitemap = '';
	try {
		sitemapArray.forEach(uri => {
			sitemap += `${siteBaseUrl}${uri}\n`;
		});
	} catch (e) {}
	fs.writeFile(sitemapDestinationFileName, sitemap, 'utf-8', error => {
		if (error) {
			console.error(error);
			process.exit(1);
		} else {
			console.log('Created sitemap successfully');
		}
	});
};

const getVariableFromConfig = (varName, config) => {
	const nestedVarList = varName.split('.');
	return nestedVarList.reduce((accumulator, v) => {
		try {
			return accumulator[v];
		} catch (e) {
			return undefined;
		}
	}, config);
};

// const scriptIdentifier = '<!--{{CONFIG_SCRIPT}}-->';
const scriptIdentifier = '<script src="/config.js"></script>';
const getVariableNameFromMatch = match => match.substring(2, match.length - 2);
fs.readFile(
	indexHTMLFileName,
	{ encoding: 'utf-8' },
	(indexFileReadError, indexFile) => {
		if (indexFileReadError) {
			console.error(indexFileReadError);
			process.exit(1);
		} else {
			fs.readFile(fileName, { encoding: 'utf-8' }, (error, data) => {
				if (error) {
					console.error(error);
					process.exit(1);
				} else {
					// eslint-disable-next-line no-eval
					eval(data);
					const config = window.config;
					let withScriptIndexHTML = indexFile.replace(
						scriptIdentifier,
						`<script>${data}</script>`
					);
					const variableOccurances = withScriptIndexHTML.match(regex);
					//.map(getVariableNameFromMatch);
					variableOccurances.forEach(occurance => {
						const varName = getVariableNameFromMatch(occurance);
						withScriptIndexHTML = withScriptIndexHTML.replace(
							occurance,
							getVariableFromConfig(varName, config)
						);
					});
					console.log(`Writing to file ${destinationFileName}...`);
					fs.writeFile(
						destinationFileName,
						withScriptIndexHTML,
						'utf-8',
						writeError => {
							if (writeError) {
								process.exit(1);
							} else {
								console.log(`Successfully created file ${destinationFileName}`);
							}
						}
					);
					createSitemap(config.sitemap);
				}
			});
		}
	}
);
