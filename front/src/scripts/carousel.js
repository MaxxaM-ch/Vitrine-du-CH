(function () {
    var LOGO_PATH = './assets/images/logos/';
    var PLAYER_PATH = './assets/images/players/';
    var INTERVAL_MS = 5000;

    // Each entry pairs a team logo with the two player photos shown alongside it.
    var PAIRS = [
        { logo: 'logo_1.png', players: ['players_1.png', 'players_2.png'] },
        { logo: 'logo_2.png', players: ['players_3.png', 'players_4.png'] },
        { logo: 'logo_3.png', players: ['players_5.png', 'players_6.png'] },
        { logo: 'logo_4.png', players: ['players_7.png', 'players_8.png'] },
    ];

    // Each region is synced to the same pair index but owns its own DOM slot and image source.
    var REGIONS = [
        { role: 'logo', path: LOGO_PATH, pick: function (pair) { return pair.logo; } },
        { role: 'photo-left', path: PLAYER_PATH, pick: function (pair) { return pair.players[0]; } },
        { role: 'photo-right', path: PLAYER_PATH, pick: function (pair) { return pair.players[1]; } },
    ];

    function preload(src) {
        new Image().src = src;
    }

    function createCrossfader(container) {
        var layers = container.querySelectorAll('.carousel__layer');

        return function setImage(src) {
            var current = layers[0].classList.contains('is-visible') ? 0 : 1;
            var next = 1 - current;

            layers[next].src = src;
            layers[next].classList.add('is-visible');
            layers[current].classList.remove('is-visible');
        };
    }

    // Warm the browser cache for every pair up front so a crossfade never waits on a fetch.
    REGIONS.forEach(function (region) {
        PAIRS.forEach(function (pair) {
            preload(region.path + region.pick(pair));
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        var setters = [];

        for (var i = 0; i < REGIONS.length; i++) {
            var el = document.querySelector('[data-carousel-role="' + REGIONS[i].role + '"]');
            if (!el) {
                return;
            }
            setters.push({ region: REGIONS[i], set: createCrossfader(el) });
        }

        var pairIndex = 0;

        setInterval(function () {
            pairIndex = (pairIndex + 1) % PAIRS.length;
            var pair = PAIRS[pairIndex];

            setters.forEach(function (setter) {
                setter.set(setter.region.path + setter.region.pick(pair));
            });
        }, INTERVAL_MS);
    });
})();
