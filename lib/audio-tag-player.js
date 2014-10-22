/**
 * A player using audio tags
 */

function AudioTagPlayer () {
  this.audios = {}
  this.loaded = {}
}

var p = AudioTagPlayer.prototype

p.load = function (url, cb) {
  var audio = this.audios[url]
  if (audio) {
    if (cb) {
      if (!this.loaded[url]) {
        audio.addEventListener('loadeddata', cb)
      } else {
        cb()
      }
    }
    return
  }
  audio = this.audios[url] = new Audio()
  audio.src = url
  audio.load()
  var self = this
  audio.addEventListener('loadeddata', function () {
    self.loaded[url] = true
    if (cb) cb()
  })
}

p.play = function (url) {
  var loaded = this.loaded[url]
  if (!loaded) {
    console.warn(
      'audio: attempting to play file: ' + url +
      ' which is not loaded yet.'
    )
    return
  }
  var audio = this.audios[url]
  audio.play()
}

p.stop = function (url) {
  var loaded = this.loaded[url]
  if (loaded) {
    var audio = this.audios[url]
    audio.pause()
    audio.currentTime = 0
  }
}

p.loadAll = function (files, cb) {
  var loaded = 0
  var self = this
  files.forEach(function (file) {
    self.load(file, function () {
      loaded++
      if (loaded >= files.length) {
        cb()
      }
    })
  })
}

p.durationOf = function (url) {
  if (this.loaded[url]) {
    return this.audios[url].duration
  }
}

p.time = function (url) {
  if (this.loaded[url]) {
    return this.audios[url].currentTime
  }
}

module.exports = AudioTagPlayer