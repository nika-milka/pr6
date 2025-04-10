const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'cache.json');
const CACHE_DURATION = 60 * 1000; // 1 минута

function cacheData(data) {
  const cache = {
    data,
    timestamp: Date.now()
  };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

function getCachedData() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE));
    if (Date.now() - cache.timestamp > CACHE_DURATION) {
      return null; // Кэш устарел
    }
    
    return cache.data;
  } catch (error) {
    return null;
  }
}

function getCacheTimestamp() {
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE));
    return cache.timestamp;
  } catch (error) {
    return 0;
  }
}

module.exports = {
  cacheData,
  getCachedData,
  getCacheTimestamp
};