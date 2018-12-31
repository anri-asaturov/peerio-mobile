// eslint-disable-next-line
const otplib = require('otplib');

const input = process.argv[2];
console.log(`For input: ${input}`);
const result = otplib.authenticator.generate(input);

console.log(result);
