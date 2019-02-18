var apiLink;

if (window.location.hostname === 'wacdaq.pro') {
  apiLink = 'https://api.wacdaq.pro/'
} else {
  apiLink = 'https://testapi.wacdaq.pro/'
}

// apiLink = 'https://api.wacdaq.pro/';

export default apiLink;