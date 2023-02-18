module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{js,html,css,json,md}'
	],
	swDest: './sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};