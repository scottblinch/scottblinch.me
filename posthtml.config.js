const constants = {
  name: 'Scott Blinch',
  occupation: 'Front end web developer',
  location: 'Toronto, Ontario, Canada',
  url: 'http://scottblinch.me/',
  locale: 'en-CA',
  twitter: '@scottblinch',
};

module.exports = {
  plugins: {
    'posthtml-expressions': {
      root: './',
      locals: {
        ...constants,
        title: `${constants.name} - ${constants.occupation} - ${constants.location}`,
        seoDescription: `${constants.name} is a ${constants.occupation.toLowerCase()} based in ${constants.location}, working with HTML, CSS, JS (vanilla or otherwise), with an emphasis on accessibility.`,
      },
    },
  },
};
