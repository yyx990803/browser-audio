# Browser Audio

A simple cross-browser audio player. Uses Web Audio when possible (except in Firefox where HTML5 `<audio>` works better) and falls back to HTML5 `<audio>`. Supports IE10+.

The file formats supported depends on the underlying Browser implementation, but `.mp3` should work in most situations.

## Usage

``` bash
npm install browser-audio
```

``` js
var audio = require('browser-audio')
var file = audio.create('url-to-file.mp3')

file.play() // plays when loaded
// or...
// files are instances of EventEmitters
file.once('load', file.play.bind(file))

// other methods/properties:
file.stop()
file.state // 'loading' or 'loaded'
file.duration
file.currentTime

// multiple file load helper
var file1 = audio.create('...')
var file2 = audio.create('...')
audio.whenLoaded([file1, file2], function () {
  // all files loaded
})
```

## License

MIT