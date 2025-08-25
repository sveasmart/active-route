/* eslint-disable @typescript-eslint/no-use-before-define */
let fr = null;
let ir = null;
let configDef = {};

const checkRouteOrPath = (arg) => {
    try {
        check(arg, Match.OneOf(RegExp, String));
    } catch (error) {
        throw new Error(errorMessages.invalidRouteNameArgument);
    }
};

const checkParams = (arg) => {
    try {
        check(arg, Object);
    } catch (error) {
        throw new Error(errorMessages.invalidRouteParamsArgument);
    }
};

const checkRouterPackages = () => {
    fr = Package["kadira:flow-router"] || Package["meteorhacks:flow-router"] || Package["kadira:flow-router-ssr"];
    ir = Package["vlasky:galvanized-iron-router"];

    if (!ir && !fr) {
        throw new Error(errorMessages.noSupportedRouter);
    }
};

const errorMessages = {
    noSupportedRouter:
        "No supported router installed. Please install " + "vlasky:galvanized-iron-router or meteorhacks:flow-router.",

    invalidRouteNameArgument: "Invalid argument, must be String or RegExp.",
    invalidRouteParamsArgument: "Invalid arguemnt, must be Object.",
};

configDef.config = new ReactiveDict("activeRouteConfig");

configDef.config.setDefault({
    activeClass: "active",
    caseSensitive: true,
    disabledClass: "disabled",
});

const test = (value, pattern) => {
    if (!value) return false;

    let result;

    if (Match.test(pattern, RegExp)) {
        result = value.search(pattern);
        result = result > -1;
    } else if (Match.test(pattern, String)) {
        if (configDef.config.equals("caseSensitive", false)) {
            value = value.toLowerCase();
            pattern = pattern.toLowerCase();
        }

        result = value === pattern;
    }

    return result || false;
};

const ActiveRouteConfig = {
    config() {
        return this.configure.apply(this, arguments);
    },

    configure(options) {
        if (Meteor.isServer) return;

        configDef.config.set(options);
        return;
    },

    name(routeName, routeParams = {}) {
        checkRouterPackages();

        if (Meteor.isServer && !Package["kadira:flow-router-ssr"]) {
            return;
        }

        checkRouteOrPath(routeName);
        checkParams(routeParams);

        let currentPath;
        let currentRouteName;
        let path;

        if (ir) {
            if (Object.keys(routeParams).length > 0 && Match.test(routeName, String)) {
                const controller = ir.Router.current();
                if (controller?.route) {
                    currentPath = controller.location.get().path;
                }
                path = ir.Router.path(routeName, routeParams);
            } else {
                currentRouteName = ir.Router.current()?.route?.getName?.();
            }
        }

        if (fr) {
            if (Object.keys(routeParams).length > 0 && Match.test(routeName, String)) {
                fr.FlowRouter.watchPathChange();
                currentPath = currentPath || fr.FlowRouter.current().path;
                path = path || fr.FlowRouter.path(routeName, routeParams);
            } else {
                currentRouteName = currentRouteName || fr.FlowRouter.getRouteName();
            }
        }

        return test(currentPath || currentRouteName, path || routeName);
    },

    path(path) {
        checkRouterPackages();

        if (Meteor.isServer) return;

        checkRouteOrPath(path);

        let currentPath;

        if (ir) {
            const controller = ir.Router.current();
            if (controller?.route) {
                currentPath = controller.location.get().path;
            }
        }

        if (fr) {
            fr.FlowRouter.watchPathChange();
            currentPath = currentPath || fr.FlowRouter.current().path;
        }

        return test(currentPath, path);
    },
};

ActiveRoute = ActiveRouteConfig;
share = configDef;
