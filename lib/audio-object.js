var AudioTagPlayer = require('./audio-tag-player')
var WebAudioPlayer = require('./web-audio-player')
var Emitter = require('events').EventEmitter
var AudioContext = window.AudioContext || window.webkitAudioContext

var player
if (AudioContext) {
  try {
    // Chrome throws error when having too many AudioContexts
    console.log('audio context')
    player = new WebAudioPlayer(AudioContext)
  } catch (e) {
    console.log('error, fallback to audio tag')
    player = new AudioTagPlayer()
  }
} else {
  player = new AudioTagPlayer()
}

function noop () {}

function AudioObject (url) {
  Emitter.call(this)
  this.url = url
  this.state = 'loading'
  player.load(url, function () {
    this.state = 'loaded'
    this.emit('load')
  }.bind(this))
}

var p = AudioObject.prototype = Object.create(Emitter.prototype)

p.play = function () {
  if (this.state === 'loaded') {
    player.play(this.url)
  } else {
    this.once('load', this.play.bind(this))
  }
}

p.stop = function () {
  player.stop(this.url)
}

Object.defineProperty(p, 'duration', {
  enumerable: true,
  get: function () {
    return player.durationOf(this.url)  
  },
  set: noop
})

Object.defineProperty(p, 'currentTime', {
  enumerable: true,
  get: function () {
    return player.time(this.url)
  },
  set: noop
})

module.exports = AudioObject