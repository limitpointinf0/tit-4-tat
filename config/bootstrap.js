/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  // Import dependencies
  var path = require('path');

  // This bootstrap version indicates what version of fake data we're dealing with here.
  var HARD_CODED_DATA_VERSION = 5;

  // This path indicates where to store/look for the JSON file that tracks the "last run bootstrap info"
  // locally on this development computer (if we happen to be on a development computer).
  var bootstrapLastRunInfoPath = path.resolve(sails.config.appPath, '.tmp/bootstrap-version.json');

  // Whether or not to continue doing the stuff in this file (i.e. wiping and regenerating data)
  // depends on some factors:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // If the hard-coded data version has been incremented, or we're being forced
  // (i.e. `--drop` or `--environment=test` was set), then run the meat of this
  // bootstrap script to wipe all existing data and rebuild hard-coded data.
  if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
    // If this is _actually_ a production environment (real or simulated), or we have
    // `migrate: safe` enabled, then prevent accidentally removing all data!
    if (process.env.NODE_ENV==='production' || sails.config.models.migrate === 'safe') {
      sails.log.warn('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "'+sails.config.environment+'" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
      return done();
    }//•

    // Compare bootstrap version from code base to the version that was last run
    var lastRunBootstrapInfo = await sails.helpers.fs.readJson(bootstrapLastRunInfoPath)
    .tolerate('doesNotExist');// (it's ok if the file doesn't exist yet-- just keep going.)

    if (lastRunBootstrapInfo && lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION) {
      sails.log('Skipping v'+HARD_CODED_DATA_VERSION+' bootstrap script...  (because it\'s already been run)');
      sails.log('(last run on this computer: @ '+(new Date(lastRunBootstrapInfo.lastRunAt))+')');
      return done();
    }//•

    sails.log('Running v'+HARD_CODED_DATA_VERSION+' bootstrap script...  ('+(lastRunBootstrapInfo ? 'before this, the last time the bootstrap ran on this computer was for v'+lastRunBootstrapInfo.lastRunVersion+' @ '+(new Date(lastRunBootstrapInfo.lastRunAt)) : 'looks like this is the first time the bootstrap has run on this computer')+')');
  }
  else {
    sails.log('Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)');
  }

  // Since the hard-coded data version has been incremented, and we're running in a "trashable" environment,
  // delete all records from all models.
  for (let identity in sails.models) {
    await sails.models[identity].destroy({});
  }//∞

  // By convention, this is a good place to set up fake data during development.

  // Create some fake users, fetching the records so we can do more stuff below.
  await User.create({ emailAddress: 'admin@example.com', fullName: 'Ryan Dahl', isSuperAdmin: true, pointsBalance: 100, password: await sails.helpers.passwords.hashPassword('abc123') }).fetch();
  var rory = await User.create({ emailAddress: 'rory@example.com', fullName: 'Rory Milliard', pointsBalance: 100, password: await sails.helpers.passwords.hashPassword('abc123') }).fetch();
  var raquel = await User.create({ emailAddress: 'raquel@example.com', fullName: 'Raquel Estevez', pointsBalance: 100, password: await sails.helpers.passwords.hashPassword('abc123') }).fetch();
  var rachael = await User.create({ emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', pointsBalance: 100, password: await sails.helpers.passwords.hashPassword('abc123') }).fetch();
  var mike = await User.create({ emailAddress: 'mike@example.com', fullName: 'Mike McNeil', pointsBalance: 100, password: await sails.helpers.passwords.hashPassword('abc123') }).fetch();
  var chris = await User.create({ emailAddress: 'chris@example.com', fullName: 'Chris', pointsBalance: 100, password: await sails.helpers.passwords.hashPassword('abc123') }).fetch();

  // Start some friendships.
  await User.addToCollection(rory.id, 'friends').members([raquel.id, rachael.id, mike.id]);
  await User.addToCollection(raquel.id, 'friends').members([rory.id, rachael.id, mike.id]);
  await User.addToCollection(rachael.id, 'friends').members([rory.id, raquel.id, mike.id]);
  await User.addToCollection(mike.id, 'friends').members([rory.id, raquel.id, rachael.id]);

  await Instagram.create({ description: 'testing1', url: 'https://www.instagram.com/p/CQiRNQ5HlEF/', points: 5, type: 'post', engagement:'like', active: false, owner: rory.id});
  await Instagram.create({ description: 'testing2', url: 'https://www.instagram.com/p/COqVyjvHVJe/', points: 10, type: 'page', engagement:'follow', active: true, owner: rory.id});
  await Instagram.create({ description: 'testing3', url: 'https://www.instagram.com/p/CODj1etHCfK/', points: 10, type: 'page', engagement:'follow', active: false, owner: mike.id});
  await Instagram.create({ description: 'testing4', url: 'https://www.instagram.com/p/CNjxLKOndso/', points: 5, type: 'post', engagement:'like', active: true, owner: mike.id});
  await Instagram.create({ description: 'testing5', url: 'https://www.instagram.com/p/CM0LSE8HU1E/', points: 10, type: 'post', engagement:'like', active: true, owner: raquel.id});
  await Instagram.create({ description: 'testing6', url: 'https://www.instagram.com/p/CMrt_hEHQt9/', points: 5, type: 'page', engagement:'follow', active: true, owner: raquel.id});
  await Instagram.create({ description: 'testing7', url: 'https://www.instagram.com/p/CMWUPjnH8Yv/', points: 5, type: 'post', engagement:'like', active: true, owner: chris.id});
  await Instagram.create({ description: 'testing8', url: 'https://www.instagram.com/p/CMIIJ7Bn3mF/', points: 10, type: 'post', engagement:'follow', active: true, owner: chris.id});

  // Save new bootstrap version
  await sails.helpers.fs.writeJson.with({
    destination: bootstrapLastRunInfoPath,
    json: {
      lastRunVersion: HARD_CODED_DATA_VERSION,
      lastRunAt: Date.now(),
    },
    force: true
  })
  .tolerate((err)=>{
    sails.log.warn('For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or a limitation around cwd on your hosting provider.  As a workaround, try updating app.js to explicitly use __dirname.  Current sails.config.appPath: `'+sails.config.appPath+'`.  Full error details: '+err.stack+'\n\n(Proceeding anyway this time...)');
  });

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
