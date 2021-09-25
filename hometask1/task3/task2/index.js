import csv from 'csvtojson';
import fs from 'fs';

const csvFilePath = 'task2/nodejs-hw1-ex1.csv';
const txtFilePath = 'task3/task2/result.txt';

const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream(txtFilePath);

writeStream.on('error', (err) => console.error(err));

readStream.pipe(csv()).pipe(writeStream);

// csv()
//   .fromFile(csvFilePath)
//   .then((jsonObj) => {
//     jsonObj.forEach((item) => {
//       try {
//         fs.appendFileSync(txtFilePath, `${JSON.stringify(item)}\n`);
//         console.log('Saved');
//       } catch (err) {
//         console.log(err);
//       }
//     });
//   });
