// Cuando Se Conecta Alguien Nuevo Emitir Jugadores Cercanos a todos...
io.emit('nearest_players', {
    list: system._MainRoom.getAllClients().map( cl => {
        return {
            gamertag: cl.getGamertag(),
            peerID: cl.getPeerId(),
            socketID: cl.getSocketId()
        }
    })
});

// por cada cliente en la sala llamar al cliente recien conectado...
for (let i = 0; i < system._MainRoom.getAllClients().length; i++) {
    const theClient = system._MainRoom.getAllClients()[i];
    
    // llamar a otro peer...
    theClient.Call(data.peerID);
}