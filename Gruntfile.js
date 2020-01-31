/* eslint-disable func-names */
/* eslint-disable no-console */
const db = require('./src/db');

module.exports = grunt => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    fixtures: {
      seed: {
        src: ['fixtures/*.js'],
        models() {
          return db.getModels();
        },
        options: {
          logger: {
            debug: console.log,
            info: console.log,
            warn: console.log,
            error: console.log
          }
        }
      }
    }
  });

  grunt.registerTask('sync', 'Initialize the database', function(force) {
    const done = this.async();
    db.sync({ force }).then(done);
  });

  grunt.loadNpmTasks('sequelize-fixtures');
};
