var AudioObject = require('./lib/audio-object')

module.exports = {

  create: function (url) {
    return new AudioObject(url)
  },

  whenLoaded: function (objects, cb) {
    var loaded = 0
    if (!Array.isArray(objects)) {
      objects = [objects]
    }
    objects.forEach(function (o) {
      if (o.state === 'loaded') {
        check()
      } else {
        o.once('load', check)
      }
    })
    function check () {
      loaded++
      if (loaded === objects.length) {
        cb()
      }
    }
  }

}