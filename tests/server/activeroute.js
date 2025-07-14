const makeServerTests = () => {
    describe("Should always return undefined", () => {
        it("ActiveRoute.config", () => {
            expect(ActiveRoute.config({ caseSensitive: false })).to.be.undefined;
        });

        it("ActiveRoute.configure", () => {
            expect(ActiveRoute.configure({ caseSensitive: false })).to.be.undefined;
        });

        it("ActiveRoute.name", () => {
            expect(ActiveRoute.name("home")).to.be.undefined;
        });

        it("ActiveRoute.path", () => {
            expect(ActiveRoute.path("/")).to.be.undefined;
        });
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

    describe("Server", () => {
        makeServerTests();
    });
});
