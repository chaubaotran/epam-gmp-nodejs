const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = 'task2/nodejs-hw1-ex1.csv';
const txtFilePath = 'task2/result.txt';

csv()
  .fromFile(csvFilePath)
  .then(function (jsonObj) {
    jsonObj.forEach(function (line) {
      fs.appendFileSync(txtFilePath, JSON.stringify(line) + '\n', function (err) {
        console.log(err);
      });
    });
  });
