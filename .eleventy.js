import {EleventyHtmlBasePlugin} from '@11ty/eleventy';

const SOURCE_FOLDER = 'src';

function formatDatePart(number) {
	return number.toString().padStart(2, '0');
}

export default function(config) {
	config.addPlugin(EleventyHtmlBasePlugin);

	config.addPassthroughCopy(`${SOURCE_FOLDER}/css`);
	config.addPassthroughCopy(`${SOURCE_FOLDER}/fonts`);
	config.addPassthroughCopy(`${SOURCE_FOLDER}/images`);
	config.addPassthroughCopy(`${SOURCE_FOLDER}/js`);

	const fqdn = 'www.rodano.ch';
	config.addGlobalData('fqdn', fqdn);
	config.addGlobalData('url', `https://${fqdn}`);
	config.addGlobalData('rodano', 'Rodano');

	config.addFilter('isoDate', date => {
		return `${date.getFullYear()}-${formatDatePart(date.getMonth() + 1)}-${formatDatePart(date.getDate())}`;
	});

	return {
		templateFormats: [
			'njk', 'html'
		],
		dir: {
			input: SOURCE_FOLDER
		}
	};
}
