const makeRouteTests = (inverse = false) => {
    const inverseStr = inverse ? "Not" : "";
    const result = inverse ? "disabled" : "active";
    const routeName = inverse ? "notHome" : "home";
    const inverseRouteName = inverse ? "home" : "notHome";
    const cls = inverse ? "is-disabled" : "is-selected";

    it(`{{is${inverseStr}ActiveRoute '${routeName}'}}`, () => {
        expect(Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](routeName)).to.be.a("string", result);
    });

    it(`{{is${inverseStr}ActiveRoute name='${routeName}'}}`, () => {
        expect(
            Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](
                Spacebars.kw({
                    name: routeName,
                })
            )
        ).to.be.a("string", result);
    });

    it(`{{is${inverseStr}ActiveRoute class='${cls}' name='${routeName}'}}`, () => {
        const options = Spacebars.kw({
            class: cls,
            name: routeName,
        });

        expect(Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](options)).to.be.a("string", cls);
    });

    it(`{{is${inverseStr}ActiveRoute className='${cls}' name='${routeName}'}}`, () => {
        const options = Spacebars.kw({
            className: cls,
            name: routeName,
        });

        expect(Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](options)).to.be.a(
            "string",
            inverse ? "is-disabled" : "is-selected"
        );
    });

    it(`{{is${inverseStr}ActiveRoute regex='${routeName}'}}`, () => {
        expect(
            Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](
                Spacebars.kw({
                    regex: routeName,
                })
            )
        ).to.be.a("string", result);
    });

    it(`{{is${inverseStr}ActiveRoute '${routeName}'}}`, () => {
        expect(Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](inverseRouteName)).to.be.false;
    });

    it(`{{is${inverseStr}ActiveRoute '${routeName}' class='${cls}'}}`, () => {
        expect(
            Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](
                routeName,
                Spacebars.kw({
                    class: cls,
                })
            )
        ).to.be.a("string", cls);
    });

    it(`{{is${inverseStr}ActiveRoute options}}`, () => {
        const options = {
            name: routeName,
        };

        expect(Blaze._globalHelpers[`is${inverseStr}ActiveRoute`](options)).to.be.a("string", result);
    });
};

const makePathTests = (inverse = false) => {
    const inverseStr = inverse ? "Not" : "";
    const result = inverse ? "disabled" : "active";
    const path = inverse ? "/notHome" : "/";
    const regexPath = inverse ? "\\/notHome" : "\\/";
    const inversePath = inverse ? "/" : "/notHome";
    const cls = inverse ? "is-disabled" : "is-selected";

    it(`{{is${inverseStr}ActivePath path}}`, () => {
        expect(Blaze._globalHelpers[`is${inverseStr}ActivePath`](path)).to.be.a("string", result);
    });

    it(`{{is${inverseStr}ActivePath path='${path}'}}`, () => {
        expect(
            Blaze._globalHelpers[`is${inverseStr}ActivePath`](
                Spacebars.kw({
                    path: path,
                })
            )
        ).to.be.a("string", result);
    });

    it(`{{is${inverseStr}ActivePath class='${cls}' path='${path}'}}`, () => {
        const options = Spacebars.kw({
            class: cls,
            path: path,
        });

        expect(Blaze._globalHelpers[`is${inverseStr}ActivePath`](options)).to.be.a("string", cls);
    });

    it(`{{is${inverseStr}ActivePath className='${cls}' path='${path}'}}`, () => {
        const options = Spacebars.kw({
            className: cls,
            path: path,
        });

        expect(Blaze._globalHelpers[`is${inverseStr}ActivePath`](options)).to.be.a("string", cls);
    });

    it(`{{is${inverseStr}ActivePath regex='${regexPath}'}}`, () => {
        expect(
            Blaze._globalHelpers[`is${inverseStr}ActivePath`](
                Spacebars.kw({
                    regex: regexPath,
                })
            )
        ).to.be.a("string", result);
    });

    it(`{{is${inverseStr}ActivePath '${inversePath}'}}`, () => {
        expect(
            Blaze._globalHelpers[`is${inverseStr}ActivePath`](
                Spacebars.kw({
                    path: inversePath,
                })
            )
        ).to.be.false;
    });

    it(`{{is${inverseStr}ActivePath '${path}' class='${cls}'}}`, () => {
        expect(
            Blaze._globalHelpers[`is${inverseStr}ActivePath`](
                path,
                Spacebars.kw({
                    class: cls,
                })
            )
        ).to.be.a("string", cls);
    });

    it(`{{is${inverseStr}ActivePath options}}`, () => {
        const options = {
            path: path,
        };

        expect(Blaze._globalHelpers[`is${inverseStr}ActivePath`](options)).to.be.a("string", result);
    });
};

describe("Router: vlasky:galvanized-iron-router", () => {
    after(() => {
        delete Package["vlasky:galvanized-iron-router"];
    });

    before(() => {
        const Router = {
            current: () => ({
                route: {
                    getName: () => "home",
                },
                location: {
                    get: () => ({
                        path: "/",
                    }),
                },
            }),
        };

        Package["vlasky:galvanized-iron-router"] = { Router };
    });

    describe("Client", () => {
        makeRouteTests();
        makeRouteTests(true);
        makePathTests();
        makePathTests(true);
    });
});

describe("Router: meteorhacks:flow-router", () => {
    after(() => {
        delete Package["meteorhacks:flow-router"];
    });

    before(() => {
        const Router = {
            current: () => ({
                path: "/",
            }),
            getRouteName: () => "home",
            watchPathChange: () => {},
        };

        Package["meteorhacks:flow-router"] = { FlowRouter: Router };
    });

    describe("Client", () => {
        makeRouteTests();
        makeRouteTests(true);
        makePathTests();
        makePathTests(true);
    });
});

describe("Router: kadira:flow-router", () => {
    after(() => {
        delete Package["kadira:flow-router"];
    });

    before(() => {
        const Router = {
            current: () => ({
                path: "/",
            }),
            getRouteName: () => "home",
            watchPathChange: () => {},
        };

        Package["kadira:flow-router"] = { FlowRouter: Router };
    });

    describe("Client", () => {
        makeRouteTests();
        makeRouteTests(true);
        makePathTests();
        makePathTests(true);
    });
});
