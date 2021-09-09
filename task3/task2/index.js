import csv from 'csvtojson';
import fs from 'fs';

const csvFilePath = 'task2/nodejs-hw1-ex1.csv';
const txtFilePath = 'task3/task2/result.txt';

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    jsonObj.forEach((item) => {
      try {
        fs.appendFileSync(txtFilePath, `${JSON.stringify(item)}\n`);
        console.log('Saved');
      } catch (err) {
        console.log(err);
      }
    });
  });
