const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = 'task2/nodejs-hw1-ex1.csv';
const txtFilePath = 'task2/result.txt';

csv()
  .fromFile(csvFilePath)
  .then(function (jsonObj) {
    jsonObj.forEach(function (item) {
      try {
        fs.appendFileSync(txtFilePath, `${JSON.stringify(item)}\n`);
        console.log('Saved');
      } catch (err) {
        console.log(err);
      }
    });
  });
