export class WorldData {
    constructor() {
        /** @type {Array<Object>} */
        this.players = [];
    }

    /**
     * 
     * @param {String} gamertag
     * @description Devuelve un booleano si el jugador con el gamertag esta en el servidor... 
     */
    isConnected( gamertag ) {
        return this.players.some( p => p.gamertag === gamertag );
    }
}