var counter = {};
for (var i = 0; i < 10000000; i++) {
  var random = Math.ceil(Math.random() * 100); 
  if (!counter[random]) {
    counter[random] = 0;
  }
  counter[random]++;
}
console.log(counter);