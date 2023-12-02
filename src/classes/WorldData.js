export class WorldData {
    constructor() {
        
        // const struc = {
        //     gamertag: player.name,
        //     position: {
        //         x: Math.trunc(player.location.x),
        //         y: Math.trunc(player.location.y),
        //         z: Math.trunc(player.location.z)
        //     },
        //     dimension: player.dimension.id
        // }

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