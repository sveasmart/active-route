Package.describe({
  git     : "https://github.com/meteor-activeroute/legacy.git",
  name    : "zimme:active-route",
  summary : "Active route helpers",
  version : "2.5.0"
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@2.16");

  api.use([
    "check",
    "reactive-dict",
    "underscore"
  ]);

  api.use([
    "kadira:flow-router@2.0.0",
    "meteorhacks:flow-router@1.8.0",
    "vlasky:galvanized-iron-router:router@2.0.1"
  ], { weak : true });

  // made templating a non-weak dependency
  api.use(["templating", "spacebars", "blaze"], "client");

  api.export("ActiveRoute");

  api.addFiles("lib/activeroute.js", ["client", "server"]);
  api.mainModule("client/helpers.js", "client");
});

Package.onTest(function(api) {
  api.versionsFrom("METEOR@2.16");

  api.use([
    "check",
    "reactive-dict",
    "templating",
    "underscore"
  ]);

  api.use([
    "meteortesting:mocha",
    "zimme:active-route"
  ]);

  api.addFiles([
    "tests/client/activeroute.js",
    "tests/client/helpers.js"
  ], "client");

  api.addFiles("tests/server/activeroute.js", "server");
});
