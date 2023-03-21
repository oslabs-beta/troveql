// Import the Cache class
const Cache = require('')

// Create a new instance of the Cache class
const cache = new Cache();

// Set a key-value pair in the cache
cache.set("key1", "value1");

// Get the value of a key from the cache
console.log(cache.get("key1")); // value1

// Set the cache persistence time to 5 seconds
cache.setPersistence(2000);

// Wait for 6 seconds
setTimeout(() => {
  // Get the value of a key from the cache
  console.log(cache.get("key1")); // undefined
}, 3000);
