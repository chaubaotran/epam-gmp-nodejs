process.stdin.on('readable', function () {
  let input;
  while ((input = process.stdin.read()) !== null) {
    process.stdout.write(input.toString().split('').reverse().join('') + '\n');
  }
});
