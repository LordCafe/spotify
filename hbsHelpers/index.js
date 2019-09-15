let handlebars = require("express-handlebars");
module.exports = (app, dir ) => {
    app.set('view engine', '.hbs');
    let hbs = handlebars.create({
        extname: '.hbs',
        defaultView: 'default',
        layoutsDir:  dir + '/views/pages/',
        partialsDir: dir  + '/views/partials/',
        helpers: {
            title: function(title) { return title },
            demo: function() { return 'BAR!'; }
        }
    });
    app.engine('.hbs', hbs.engine);
}