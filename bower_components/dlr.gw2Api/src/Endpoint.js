function Endpoint(key, location, isAuthenticated, paramType){
  'use strict';
  var urlFormat = gw2Api.config.createUrl(location);
  this.key = key;
  this.urlFormat = urlFormat;
  this.isAuthenticated = isAuthenticated;
  this.paramType = paramType;
  this.get = getFactory();
  this.getParameters = parameters;
  this.url = urlFactory();

  function getFactory(){
    if(isAuthenticated){
      return getAuthenticated;
    }
    return get;
  }
  function get(params){
    var url = urlFactory()(params);
    return ajax.get(url);
  }
  function getAuthenticated(params){
    var url;
    if(!params.token){
      throw new Error('token must be set on params when calling an authenticated endpoint');
    }
    url = urlFactory()(params);
    return ajax.get(url);
  }
  function urlFactory(){
    if(isAuthenticated){
      return formUrlAuthenticated;
    }
    return formUrl;
  }
  function formUrl(params){
    return params.url(urlFormat, paramType);
  }
  function formUrlAuthenticated(params){
    var url = formUrl(params);
    if(params.token){
      url = appendAuthentication(url, params.token);
    }
    return url;
  }
  /*
    The v2 API does not handle CORS preflight requests.
    Setting the Authorization header causes a preflight request.
    ArenaNet have provided a query string based workaround for CORS
    requests. https://forum-en.guildwars2.com/forum/community/api/Launching-v2-commerce-transactions/first#post5077482
  */
  function appendAuthentication(url, token){
    var tokenQs = 'access_token=' + token;
    if(url.indexOf('?') >= 0){
      return url + '&' + tokenQs;
    }
    return url + '?' + tokenQs;
  }
  function parameters(){
    if(this.paramType){
      return new gw2Api.params[paramType]();
    }
    return {};
  }
}
