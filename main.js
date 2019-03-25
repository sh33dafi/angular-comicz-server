const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const comicsSeries = [
    {
        id: 0,
        title: 'Urbanus',
        image: 'http://localhost:3000/static/urbanus.jpg',
        author: 'Urbanus & Willy Linthout',
        comics: [
            {
                number: 5,
                title: 'Het Mislukte Mirakel',
                image: 'http://www.urbanusfan.be/urbanusstrip/albums/urbanus005150.jpg'
            },
            {
                number: 10,
                title: 'Ambras In De Klas',
                image: 'http://www.urbanusfan.be/urbanusstrip/albums/urbanus010150.jpg'
            }
        ]
    },
    {
        id: 1,
        title: 'Suske en Wiske',
        image: 'http://localhost:3000/static/suskeenwiske.jpg',
        author: 'Willy Vandersteen',
        comics: []
    },
    {
        id: 2,
        title: 'Amoras',
        image: 'http://localhost:3000/static/amoras.jpg',
        author: 'Marc Legendre',
        comics: []
    },
    {
        id: 3,
        title: 'Jommeke',
        image: 'http://localhost:3000/static/jommeke.jpg',
        author: 'Jef Nys',
        comics: []
    },
    {
        id: 4,
        title: 'Nero',
        image: 'http://localhost:3000/static/nero.jpg',
        author: 'Marc Sleen',
        comics: []
    },
    {
        id: 5,
        title: 'Kuifje',
        image: 'http://localhost:3000/static/kuifje.jpg',
        author: 'Hergé',
        comics: []
    }
];

function getSeries(req, res, next) {
    const query = req.query;
    console.log(query);
    let filteredSeries = [...comicsSeries];
    if (query.filter) {
        filteredSeries = filteredSeries.filter(serie => serie.title.toLowerCase().startsWith(query.filter.toLowerCase()));
    }
    res.json(filteredSeries.map(series => {
        let {id, title, image} = series;
        return {id, title, image};
    }));
    next();
}

function getSeriesDetails(req, res, next) {
    const seriesId = req.params.id;
    const series = comicsSeries.find(series => series.id == seriesId);
    console.log(seriesId, series);
    if (series) {
        let {title, author, comics} = series;
        res.json({title, author, comics});
    } else {
        res.status(404);
        res.end();
    }
    next();
}

function createSeries(req, res, next) {
    const {title, author, image} = req.body;

    const newSeries = {title, author, image: (image || 'https://via.placeholder.com/200x280.png'), id: comicsSeries.length};
    comicsSeries.push(newSeries);
    res.json(newSeries);
    next();
}

const server = restify.createServer({url: 'localhost'});

const cors = corsMiddleware({
    origins: ['*'],
    credentials: false, // defaults to false
    headers: ['']  // sets expose-headers
});

server.use(cors.actual);
server.pre(cors.preflight);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/api/series', getSeries);
server.get('/api/series/:id', getSeriesDetails);
server.post('/api/series', createSeries);

server.get(
    '/static/*',
    restify.plugins.serveStatic({
        directory: `${__dirname}/static`,
        appendRequestPath: false
    })
);

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});
