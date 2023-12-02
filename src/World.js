export class World {
    #clients

    constructor() {
        this.#clients = []
    }

    /**
     * 
     * @param {String} gamertag 
     * @param {String} id 
     * @description Adds a new client.
     */
    addClient( data ) {
        this.#clients.push(data);
    }

    /**
     * @returns {Array}
     * @description Obtiene los clientes conectados...
     */
    getClients() {
        return this.#clients;
    }
}