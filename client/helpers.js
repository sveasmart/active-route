// Delay registration until the environment is fully ready
Meteor.startup(() => {
    if (!Package.templating?.Template || !Package.spacebars?.Spacebars) {
        return;
    }

    const Template = Package.templating.Template;
    const Spacebars = Package.spacebars.Spacebars;

    const isActive = (type, inverse = false) => {
        let helperName = "is";

        if (inverse) {
            helperName += "Not";
        }

        helperName += `Active${type}`;

        return (options = {}, attributes = {}) => {
            if (Match.test(options, Spacebars.kw)) {
                options = options.hash;
            }

            if (Match.test(attributes, Spacebars.kw)) {
                attributes = attributes.hash;
            }

            if (Match.test(options, String)) {
                if (share.config.equals("regex", true)) {
                    options = {
                        regex: options,
                    };
                } else if (type === "Path") {
                    options = {
                        path: options,
                    };
                } else {
                    options = {
                        name: options,
                    };
                }
            }

            options = Object.assign({}, options, attributes);

            const pattern = Match.ObjectIncluding({
                class: Match.Optional(String),
                className: Match.Optional(String),
                regex: Match.Optional(Match.OneOf(RegExp, String)),
                name: Match.Optional(String),
                path: Match.Optional(String),
            });

            check(options, pattern);

            let { regex, name, path } = options;
            const className = options.class || options.className;

            if (type === "Path") {
                name = undefined;
            } else {
                path = undefined;
            }

            if (!regex && !name && !path) {
                const t = type === "Route" ? "name" : type;
                const lowerT = t.toLowerCase();

                console.error(
                    `Invalid argument, ${helperName} takes "${lowerT}", ` + `${lowerT}="${lowerT}" or regex="regex"`
                );

                return false;
            }

            if (Match.test(regex, String)) {
                if (share.config.equals("caseSensitive", false)) {
                    regex = new RegExp(regex, "i");
                } else {
                    regex = new RegExp(regex);
                }
            }

            regex = regex || name || path;

            const finalClassName =
                className || (inverse ? share.config.get("disabledClass") : share.config.get("activeClass"));

            const isPath = type === "Path";

            let result;

            if (isPath) {
                result = ActiveRoute.path(regex);
            } else {
                const routeOptions = Object.assign({}, attributes, attributes.data || {});
                const omitKeys = ["class", "className", "data", "regex", "name", "path"];
                const filteredOptions = Object.keys(routeOptions)
                    .filter(key => !omitKeys.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = routeOptions[key];
                        return obj;
                    }, {});
                result = ActiveRoute.name(regex, filteredOptions);
            }

            if (inverse) {
                result = !result;
            }

            return result ? finalClassName : false;
        };
    };

    const helpers = {
        isActiveRoute: isActive("Route"),
        isActivePath: isActive("Path"),
        isNotActiveRoute: isActive("Route", true),
        isNotActivePath: isActive("Path", true),
    };

    for (const [name, func] of Object.entries(helpers)) {
        Template.registerHelper(name, func);
    }
});
