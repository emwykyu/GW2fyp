# gw2Api.js

A wrapper for v2 of the [Guild Wars 2 public API](https://wiki.guildwars2.com/wiki/API:2).

Uses [Q.js](http://documentup.com/kriskowal/q/) to return promises from the API calls.

## Bower Installation
`bower install dlr.gw2Api`

## Or grab the dist folder
```
dist/gw2Api.js
dist/gw2Api.min.js
```
## Or clone the repo locally and build it yourself
```
npm install
bower install
grunt build
```
run all tests, including online tests via:
`grunt karma`

or just run the offline tests via:
`grunt karma:offline`

## Usage

Ensure you reference both Q.js and gw2Api.js
```
<script src="path/to/q.js"></script>
<script src="path/to/gw2Api.js"</script>
```
A playground available at http://dyanarose.github.io/gw2Api.js. Here you can select endpoints and set parameters to see the end code and use it to call the Guild Wars 2 API.

The [wiki](https://github.com/dyanarose/gw2Api.js/wiki) is growing with documentation.

## Example
```
var ep = gw2Api.endpoints.quaggans.url,
    params = ep.getParameters();
params.ids = ['404', 'attack'];
ep.get(params).then(function(response){
  var data, headers;
  data = response.data;
  headers = response.headers;
};
```

The above will cause a call to;
`https://api.guildwars2.com/v2/quaggans?ids=404,attack`

response.data will then hold the object: `[{"id":"404","url":"https://static.staticwars.com/quaggans/404.jpg"},{"id":"attack","url":"https://static.staticwars.com/quaggans/attack.jpg"}]`
