var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');
// var db = new Sequelize('postgres://192.168.4.141:5432/wikistack');


let Page = db.define('page', {
  title: { type: Sequelize.STRING, allowNull: false, defaultValue: 'Page Title'},
  urlTitle: { type: Sequelize.STRING, allowNull: false },
  content: { type: Sequelize.TEXT, allowNull: false, defaultValue: 'Page content empty.' },
  status: { type: Sequelize.ENUM('open', 'closed') },
  date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
  getterMethods: {
    route: function()  { return '/wiki/' + this.urlTitle }
  }
});

Page.hook('beforeValidate', function(page, options) {
  page.urlTitle = generateUrlTitle(page.title);
});

let User = db.define('user', {
  name: { type: Sequelize.STRING, allowNull: false, defaultValue: 'username' },
  email: { type: Sequelize.STRING, allowNull: false, isEmail: true, defaultValue: 'name@email.com' }
});

Page.belongsTo(User, {as: 'author'});

module.exports = {
  Page: Page,
  User: User
}

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}
