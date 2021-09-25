const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = 'task2/nodejs-hw1-ex1.csv';
const txtFilePath = 'task2/result.txt';

const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream(txtFilePath);

writeStream.on('error', (err) => console.error(err));

readStream.pipe(csv()).pipe(writeStream);

// csv()
//   .fromFile(csvFilePath)
//   .then(function (jsonObj) {
//     jsonObj.forEach(function (item) {
//       try {
//         fs.appendFileSync(txtFilePath, `${JSON.stringify(item)}\n`);
//         console.log('Saved');
//       } catch (err) {
//         console.log(err);
//       }
//     });
//   });
