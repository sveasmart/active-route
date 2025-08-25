
/* eslint-disable no-undef */
// Delay registration until the environment is fully ready
Meteor.startup(() => {
    try {
        if (!Package.templating?.Template || !Package.spacebars?.Spacebars) {
            console.warn("ActiveRoute: Required packages not available, skipping helper registration");
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
                try {
                    // Validate and normalize options
                    if (Match.test(options, Spacebars.kw)) {
                        options = options.hash;
                    }

                    if (Match.test(attributes, Spacebars.kw)) {
                        attributes = attributes.hash;
                    }

                    // Handle string shorthand
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

                    // Validate options structure
                    const pattern = Match.ObjectIncluding({
                        class: Match.Optional(String),
                        className: Match.Optional(String),
                        regex: Match.Optional(Match.OneOf(RegExp, String)),
                        name: Match.Optional(String),
                        path: Match.Optional(String),
                    });

                    try {
                        check(options, pattern);
                    } catch (validationError) {
                        console.error(`ActiveRoute ${helperName}: Invalid options structure`, validationError.message);
                        return false;
                    }

                    let { regex, name, path } = options;
                    const className = options.class || options.className;

                    // Set appropriate options based on type
                    if (type === "Path") {
                        name = undefined;
                    } else {
                        path = undefined;
                    }

                    // Validate required parameters
                    if (!regex && !name && !path) {
                        const t = type === "Route" ? "name" : type;
                        const lowerT = t.toLowerCase();

                        console.error(
                            `ActiveRoute ${helperName}: Invalid argument, requires "${lowerT}", ` +
                            `${lowerT}="${lowerT}" or regex="regex"`
                        );

                        return false;
                    }

                    // Handle regex conversion with error handling
                    if (Match.test(regex, String)) {
                        try {
                            if (share.config.equals("caseSensitive", false)) {
                                regex = new RegExp(regex, "i");
                            } else {
                                regex = new RegExp(regex);
                            }
                        } catch (regexError) {
                            console.error(`ActiveRoute ${helperName}: Invalid regex pattern "${regex}"`, regexError.message);
                            return false;
                        }
                    }

                    regex = regex || name || path;

                    // Get class names with fallback
                    let finalClassName;
                    try {
                        finalClassName = className ||
                            (inverse ? share.config.get("disabledClass") : share.config.get("activeClass"));
                    } catch (configError) {
                        console.error(`ActiveRoute ${helperName}: Error accessing config`, configError.message);
                        finalClassName = inverse ? "disabled" : "active"; // Fallback defaults
                    }

                    const isPath = type === "Path";
                    let result;

                    try {
                        if (isPath) {
                            if (!ActiveRoute?.path) {
                                console.error(`ActiveRoute ${helperName}: ActiveRoute.path method not available`);
                                return false;
                            }
                            result = ActiveRoute.path(regex);
                        } else {
                            if (!ActiveRoute?.name) {
                                console.error(`ActiveRoute ${helperName}: ActiveRoute.name method not available`);
                                return false;
                            }

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
                    } catch (activeRouteError) {
                        console.error(`ActiveRoute ${helperName}: Error checking route`, activeRouteError.message);
                        return false;
                    }

                    if (inverse) {
                        result = !result;
                    }

                    return result ? finalClassName : false;

                } catch (error) {
                    console.error(`ActiveRoute ${helperName}: Unexpected error`, error);
                    return false; // Safe fallback - don't add any class
                }
            };
        };

        const helpers = {
            isActiveRoute: isActive("Route"),
            isActivePath: isActive("Path"),
            isNotActiveRoute: isActive("Route", true),
            isNotActivePath: isActive("Path", true),
        };

        for (const [name, func] of Object.entries(helpers)) {
            try {
                Template.registerHelper(name, func);
            } catch (registrationError) {
                console.error(`ActiveRoute: Failed to register helper "${name}"`, registrationError.message);
            }
        }

    } catch (startupError) {
        console.error("ActiveRoute: Failed to initialize helpers", startupError);
    }
});
