const off = 0
const warn = 1
const error = 2

module.exports = {
	env: {
		es6: true,
		node: true,
		browser: true,
	},
	parserOptions: {
		ecmaVersion: 2020,
	},
	plugins: ['import'],
	extends: ['eslint:recommended', 'airbnb/base'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? warn : off,
		'no-debugger': process.env.NODE_ENV === 'production' ? error : off,
		'no-tabs': 0,
		indent: 'off',
		quotes: [2, 'single'],
		'linebreak-style': [2, 'unix'],
		semi: ['error', 'never'],
		'consistent-return': 0,
		'no-param-reassign': [2, { props: false }],
		'object-curly-newline': off,
		'valid-jsdoc': [
			2,
			{
				requireReturn: true,
				requireReturnDescription: false,
				requireParamDescription: false,
			},
		],
	},
}
