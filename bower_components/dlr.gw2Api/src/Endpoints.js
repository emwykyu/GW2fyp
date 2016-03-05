(function (){
  'use strict';
  var eps = {}, keys = [];

  initEndpoints();

  gw2Api.endpoints = eps;
  gw2Api.endpointKeys = keys;

  function addEndpoint(endpoint){
    utils.splitIdentifier(endpoint.key, endpoint, eps);
    keys.push(endpoint.key);
  }

  function initEndpoints(){
    addEndpoint(new Endpoint('account.url', 'account', true, 'AuthParams'));
    addEndpoint(new Endpoint('account.bank.url', 'account/bank', true, 'AuthParams'));
    addEndpoint(new Endpoint('account.dyes.url', 'account/dyes', true, 'AuthParams'));
    addEndpoint(new Endpoint('account.materials.url', 'account/materials', true, 'AuthParams'));
    addEndpoint(new Endpoint('account.skins.url', 'account/skins', true, 'AuthParams'));
    addEndpoint(new Endpoint('account.wallet.url', 'account/wallet', true, 'AuthParams'));
    addEndpoint(new Endpoint('build.url', 'build', false, 'CommonParams'));//test?
    addEndpoint(new Endpoint('characters.url', 'characters', true, 'IdsAuthParams'));
    addEndpoint(new Endpoint('characters.inventory.url', 'characters/{0}/inventory', true, 'CharacterParams'));
    addEndpoint(new Endpoint('characters.equipment.url', 'characters/{0}/equipment', true, 'CharacterParams'));
    addEndpoint(new Endpoint('colors.url', 'colors', false, 'IdsParams'));
    addEndpoint(new Endpoint('commerce.exchange.url', 'commerce/exchange', false, 'CommonParams'));
    addEndpoint(new Endpoint('commerce.exchange.coins.url', 'commerce/exchange/coins', false, 'QuantityParams'));
    addEndpoint(new Endpoint('commerce.exchange.gems.url', 'commerce/exchange/gems', false, 'QuantityParams'));
    addEndpoint(new Endpoint('commerce.listings.url', 'commerce/listings', false, 'IdsParams'));
    addEndpoint(new Endpoint('commerce.prices.url', 'commerce/prices', false, 'IdsParams'));
    addEndpoint(new Endpoint('commerce.transactions.url', 'commerce/transactions', true, 'AuthParams'));
    addEndpoint(new Endpoint('commerce.transactions.current.url', 'commerce/transactions/current', true, 'AuthParams'));
    addEndpoint(new Endpoint('commerce.transactions.current.buy.url', 'commerce/transactions/current/buy', true, 'AuthParams'));
    addEndpoint(new Endpoint('commerce.transactions.current.sell.url', 'commerce/transactions/current/sell', true, 'AuthParams'));
    addEndpoint(new Endpoint('commerce.transactions.history.url', 'commerce/transactions/history', true, 'AuthParams'));
    addEndpoint(new Endpoint('commerce.transactions.history.buy.url', 'commerce/transactions/history/buy', true, 'AuthParams'));
    addEndpoint(new Endpoint('commerce.transactions.history.sell.url', 'commerce/transactions/history/sell', true, 'AuthParams'));
    addEndpoint(new Endpoint('currencies.url', 'currencies', false, 'IdsParams'));
    addEndpoint(new Endpoint('continents.url', 'continents', false, 'IdsParams'));
    addEndpoint(new Endpoint('floors.url', 'continents/{0}/floors', false, 'FloorParams'));
    addEndpoint(new Endpoint('regions.url', 'continents/{0}/floors/{1}/regions', false, 'RegionParams'));
    addEndpoint(new Endpoint('maps.url', 'continents/{0}/floors/{1}/regions/{2}/maps', false, 'MapParams'));
    addEndpoint(new Endpoint('sectors.url', 'continents/{0}/floors/{1}/regions/{2}/maps/{3}/sectors', false, 'SectorParams'));
    addEndpoint(new Endpoint('pois.url', 'continents/{0}/floors/{1}/regions/{2}/maps/{3}/pois', false, 'PoiParams'));
    addEndpoint(new Endpoint('pvp.games.url', 'pvp/games', true, 'AuthParams'));
    addEndpoint(new Endpoint('pvp.stats.url', 'pvp/stats', true, 'AuthParams'));
    addEndpoint(new Endpoint('tasks.url', 'continents/{0}/floors/{1}/regions/{2}/maps/{3}/tasks', false, 'TaskParams'));
    addEndpoint(new Endpoint('files.url', 'files', false, 'IdsParams'));
    addEndpoint(new Endpoint('items.url', 'items', false, 'IdsParams'));
    addEndpoint(new Endpoint('materials.url', 'materials', false, 'IdsParams'));
    addEndpoint(new Endpoint('quaggans.url', 'quaggans', false, 'IdsParams'));
    addEndpoint(new Endpoint('recipes.url', 'recipes', false, 'IdsParams'));
    addEndpoint(new Endpoint('recipes.search.url', 'recipes/search', false, 'RecipeSearchParams'));
    addEndpoint(new Endpoint('specializations.url', 'specializations', false, 'IdsParams'));
    addEndpoint(new Endpoint('traits.url', 'traits', false, 'IdsParams'));
    addEndpoint(new Endpoint('skins.url', 'skins', false, 'IdsParams'));
    addEndpoint(new Endpoint('tokenInfo.url', 'tokeninfo', true, 'AuthParams'));
    addEndpoint(new Endpoint('worlds.url', 'worlds', false, 'IdsParams'));
  }
}());
