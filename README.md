### LaserDream

This is very much a work under development.
The goal of this project is to create a cross-platform desktop GUI for music-reactive live laser performances.
Eventual feature goals:
- Interactive pattern designer for beamshows and target-zone effects
- BPM auto-detection from line-in or microphone
- Beat-based pattern generators
- MIDI/OSC mapping for control surfaces
- Live 3D preview of stage
- Multiple laser support

We're currently developing user stories and mocks for the UX of the app.  View and contribute here: https://github.com/robot-head/LaserDream/wiki/User-Stories

### Package

- Uses nw.js, AngularJS, Gulp, Jade, Sass (with sourcemaps), browserSync, and Phaser
- Respects [angularjs-styleguide](https://github.com/johnpapa/angularjs-styleguide).

### Setup

- Setup [nw.js](https://github.com/nwjs/nw.js/).
- `$ npm install`
- `$ npm install -g gulp`
- `$ gem install sass`
- `$ cp config-example.json config.json`
- `$ gulp`
- `$ /path/to/nw .`

### Deployment

Run `$ gulp packages` for the production ready packages in `build/packages`.

### Contributing

I'm open for contributions via pull-requests, and please open an issue for anything you don't like.
