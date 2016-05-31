Package.describe({
  name: 'streemo:record',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Keep mongo records of everything that happens on your servers.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Streemo/record.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use(['ecmascript','mongo','underscore','random'])
  api.mainModule('Record.js', 'server');
});