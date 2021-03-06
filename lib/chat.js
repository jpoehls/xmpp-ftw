var jQuery = require('jQuery'),
    builder = require('node-xmpp'),
    Base    = require('./base')
    
var Chat = function() {}

Chat.prototype = new Base()

Chat.prototype.registerEvents = function() {
	var self = this
    this.socket.on('xmpp.chat.message', function(data) {
        self.sendMessage(data)
    })
}

Chat.prototype.handles = function(stanza) {
	return (stanza.is('message') && stanza.attrs.type == 'chat')
}

Chat.prototype.handle = function(stanza) {
    chat = { 
    	from: this._getJid(stanza.attrs.from),
    	content: jQuery(stanza.toString()).find('body').text()
    }
    this.socket.emit('xmpp.chat.message', chat)
    return true
}

Chat.prototype.sendMessage = function(data) {
	this.client.send(new builder.Element(
        'message',
        { to: data.to, type: 'chat'}
    ).c('body').t(data.message))
}
module.exports = new Chat