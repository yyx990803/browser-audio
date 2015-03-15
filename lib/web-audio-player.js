/**
* A player using the Web Audio API
*/

function WebAudioPlayer (AduioContext) {
  this.context = new AduioContext()
  this.pending = {}
  this.buffers = {}
  this.sources = {}
  this.timers = {}
}

var p = WebAudioPlayer.prototype

p.load = function (url, cb) {
  // check if there's a pending request.
  // if yes, merge the callback with the existing callback
  var request = this.pending[url]
  if (request) {
    if (cb) {
      var ocb = request.onload
      request.onload = function () {
        ocb()
        cb()
      }
    }
    return
  }
  // check if the buffer is already loaded.
  var buffer = this.buffers[url]
  if (buffer) {
    if (cb) cb()
    return
  }
  request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'
  // Decode asynchronously
  var self = this
  request.onload = function () {
    self.context.decodeAudioData(
      request.response,
      function (buffer) {
        self.buffers[url] = buffer
        if (cb) cb()
      },
      function (e) {
        console.warn(
          'audio: error decoding response for ' + url
        )
      }
    )
  }
  request.send()
}

p.play = function (url) {
  var buffer = this.buffers[url]
  if (!buffer) {
    console.warn(
      'audio: attempting to play file: ' + url +
      ' which is not loaded yet.'
    )
    return
  }
  var source = this.context.createBufferSource()
  this.sources[url] = source
  source.buffer = buffer
  source.connect(this.context.destination)
  if (typeof source.noteOn === "function") {
    source.noteOn(0)
  } else {
    source.start()
  }
  var timers = this.timers
  timers[url] = this.context.currentTime
  source.onended = function () {
    timers[url] = null
  }
}

p.stop = function (url) {
  if (this.sources[url]) {
    this.sources[url].stop(0)
    this.sources[url] = null
    this.timers[url] = null
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
  var buffer = this.buffers[url]
  if (buffer) return buffer.duration
}

p.time = function (url) {
  if (this.timers[url] != null) {
    return this.context.currentTime - this.timers[url]
  } else {
    return 0
  }
}

module.exports = WebAudioPlayer