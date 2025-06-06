Package.describe({
  git     : "https://github.com/sylido/active-route.git",
  name    : "sylido:active-route",
  summary : "Active route helpers",
  version : "2.4.0"
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@3.2.2");

  api.use([
    "check",
    "coffeescript",
    "reactive-dict",
    "underscore"
  ]);

  api.use([
    "kadira:flow-router@2.0.0",
    "meteorhacks:flow-router@1.8.0",
    "polygonwood:router@2.0.0"
  ], { weak : true });

  // made templating a non-weak dependency
  api.use(["templating", "spacebars", "blaze"], "client");

  api.export("ActiveRoute");

  api.addFiles("lib/activeroute.coffee");

  api.addFiles("client/helpers.coffee", "client");
});

Package.onTest(function(api) {
  api.versionsFrom("METEOR@3.2.2");

  api.use([
    "check",
    "coffeescript",
    "reactive-dict",
    "templating",
    "underscore"
  ]);

  api.use([
    "practicalmeteor:mocha@2.1.0_5",
    "practicalmeteor:chai@2.1.0_1",
    "zimme:active-route"
  ]);

  api.addFiles([
    "tests/client/activeroute.coffee",
    "tests/client/helpers.coffee"
  ], "client");

  api.addFiles("tests/server/activeroute.coffee", "server");
});
