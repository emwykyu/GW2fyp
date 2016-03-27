(function(){
gw2Api.config = configuration();

function configuration(){
  'use strict';
  var url = 'https://api.guildwars2.com',
  prefix = {v2: '/v2/'};

  return {
    createUrl: createUrl,
    defaultLang: null
  };

  function createUrl(location){
    return url + prefix.v2 + location;
  }
}
}());
