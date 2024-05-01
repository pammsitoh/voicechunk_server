import { vc_config } from "../../vchunk.config.js";
import { Logger } from "../utils/Logger.js";
import { Client } from "./Client.js";
import colors from 'colors';

export class Room {
    /**
    * @type {Array.<Client>}
    */
    #Clients
    #ClientsByGamertag

    constructor() {
        this.#Clients = [];
    }

    /**
     * 
     * @param {Client} client 
     * @description Agrega un nuevo cliente a la sala.
     */
    newClient( client ) {
        this.#Clients.push( client );

        // # Event #
        this.onNewClientAdded( client );
    }
    
    /**
     * @param {Client} client
     * @description Remueve un cliente de la sala.
     */
    removeClient( client ) {
        if (client) {
            const index = this.#Clients.findIndex(c => c === client);
            if (index !== -1) {
                this.#Clients.splice(index, 1);
                // # Event #
                this.onClientExit(client);
            } else {
                console.error('Cliente no encontrado en la sala.');
            }
        } else {
            Logger(`Se Intento Eliminar Un Cliente Inexistente`.red);
        }
    }

    /**
     * @param {Client} client
     * @description Remueve un cliente de la sala.
     */
    delClientById(ID) {
        const client = this.getClientById(ID);
        this.removeClient(client)
    }


    /**
     * 
     * @returns {Array.<Client>}
     * @description Retorna todos los clientes de la sala.
     */
    getAllClients() {
        return this.#Clients;
    }

    /**
     * 
     * @param {String} id 
     * @returns {Client}
     * @description Retorna un cliente especifico por su id.
     */
    getClientById( id ){
        return this.#Clients.find( c => c.getSocketId() === id );
    }

    /**
     * 
     * @param {String} gamertag 
     * @returns {Client}
     * @description Devuelve un cliente que tenga el gamertag seleccionado...
     */
    getClientByGamertag( gamertag ) {
        return this.#Clients.find( g => g.getGamertag() === gamertag );
    }

    /**
     * 
     * @returns {Array<Object>}
     */
    getTalkingClients() {
        return this.getAllClients().map( c => {
            return {
                gamertag: c.getGamertag(),
                istalking: c.isTalking()
            }
        })
    }

    /**
     * 
     * @param {String} gamertag 
     * @returns {Boolean}
     */
    existsClientByGamertag( gamertag ){
        return this.#Clients.some( cg => cg.getGamertag() === gamertag );
    }

    /**
     * 
     * @param {Array<String>} gamertagList 
     */
    validPlayersMap( gamertagList ){
        return gamertagList.map( g => {
            if( !this.existsClientByGamertag(g.gamertag) ) return;

            const selclient = this.getClientByGamertag(g.gamertag)
            selclient.setPosition(g.position.x,g.position.y,g.position.z);

            return g.gamertag;
        })
    }

    /**
     * 
     * @param {Client} firstclient 
     * @param {Client} secondclient 
     */
    getProximityVolume( firstclient, secondclient ) {
        const a = firstclient.getPosition();
        const b = secondclient.getPosition();

        // Calcular la distancia entre los puntos a y b
        const distance = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
        
        // Definir un umbral de distancia
        const threshold = 16;
        
        // Si la distancia es mayor que el umbral, devolver 0
        if (distance > threshold) return 0;
        
        // Mapear la distancia al rango de 0 a 1 usando la función sigmoide
        const proximityVolume = (threshold - distance) / threshold - 0;
        return proximityVolume;
    }

    /** 
     * @param {Array<String>} playerList
     * @description actualizar chat de proximidad...
     */
    proximityUpdate( playerList ) {
        const players = this.validPlayersMap(playerList);
        
        // calcular cercanos...
        for(const gamertag of players){
            if( gamertag === undefined || null) continue;
            const current_client = this.getClientByGamertag(gamertag);
            /** @type {Array<Client>} */
            const nearests = [];
            
            for(const gmt of players){
                if(gmt === undefined || null) continue;
                if(gmt === current_client.getGamertag()) continue;

                const ply = this.getClientByGamertag(gmt);
                if( current_client.getPosition().isInRange( ply.getPosition(), vc_config.listening_range) ){
                    // Logger(`[${ply.getGamertag()}] entro al rango de -> ${current_client.getGamertag()}`)
                    nearests.push(ply);
                }
            }

            current_client.getSocket().emit('nearest_players', {
                list: nearests.map( cl => {
                    return {
                        gamertag: cl.getGamertag(),
                        peerID: cl.getPeerId(),
                        socketID: cl.getSocketId(),
                        volume: this.getProximityVolume(current_client, cl)
                    }
                })
            });

            for(const NearestPlayer of nearests){
                current_client.Call(NearestPlayer.getPeerId());
            }
        }
    }

    // * EVENTS *

    /**
     * 
     * @param {Client} client 
     */
    onNewClientAdded( client ) {
        for (let i = 0; i < this.getAllClients().length; i++) {
            const _client = this.getAllClients()[i];

            if( _client.getPeerId != client.getPeerId ){
                _client.Call(client.getPeerId());
            }
        }
    }

    /**
     * 
     * @param {Client} client 
     */
    onClientExit( client ) {
        for (let i = 0; i < this.getAllClients().length; i++) {
            const _client = this.getAllClients()[i];

            if( _client?.getPeerId != client?.getPeerId ){
                _client?.CloseCall(client?.getPeerId());
            }
        }
    }
}