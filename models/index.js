var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

let Page = db.define('page', {
  title: { type: Sequelize.STRING, allowNull: false, defaultValue: 'Page Title'},
  urlTitle: { type: Sequelize.STRING, allowNull: false, defaultValue: 'http://dontexist' },
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

let User = db.define('user', {
  name: { type: Sequelize.STRING, allowNull: false, defaultValue: 'username' },
  email: { type: Sequelize.STRING, allowNull: false, isEmail: true, defaultValue: 'name@email.com' }
});

module.exports = {
  Page: Page,
  User: User
}
