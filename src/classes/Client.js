import { Socket } from "socket.io";
import { system } from "../../index.js";
import { Vector3 } from "./math/Vector3.js";

export class Client {
    #Gamertag
    #SocketId
    #PeerId
    #world
    #talking
    /** @type {Array<String} */
    #incomingCalls
    /*** @type {Socket} */
    #MySocket

    constructor(Gamertag, SocketId, PeerId, socket) {
        this.#Gamertag = Gamertag;
        this.#SocketId = SocketId;
        this.#PeerId = PeerId;
        
        this.#MySocket = socket;
        this.#world = {
            position: new Vector3(0, 0, 0),
            /** @type {Array<String>} */
            nearestPlayers: []
        }
        this.#incomingCalls = [];
        this.#talking = false;
    }

    /**
     * 
     * @returns {String}
     */
    getGamertag(){
        return this.#Gamertag;
    }

    /**
     * 
     * @returns {String}
     */
    getSocketId(){
        return this.#SocketId;
    }

    /**
     * 
     * @returns {String}
     */
    getPeerId(){
        return this.#PeerId;
    }

    /**
     * 
     * @returns {Socket}
     */
    getSocket(){
        return this.#MySocket;
    }

    /**
     * 
     * @returns {Vector3}
     */
    getPosition(){
        return this.#world.position;
    }

    /**
     * 
     * @returns {Array<String>}
     */
    getNearestPlayers(){
        return this.#world.nearestPlayers;
    }

    getIncomingCalls(){
        return this.#incomingCalls;
    }

    isIncomingCall(id){
        return this.#incomingCalls.some( c => c === id );
    }

    isTalking() {
        return this.#talking;
    }

    // * SETTERS

    setTalking( boo ){
        this.#talking = boo;
    }

    setPosition(x, y, z){
        this.#world.position.x = x;
        this.#world.position.y = y;
        this.#world.position.z = z;
    }

    addIncomingCall( id ){
        this.#incomingCalls.push( id );
    }

    removeIncomingCall( id ){
        const index = this.#incomingCalls.indexOf( id );
        this.#incomingCalls.splice(index, 1);
    }

    // Agregar nuevo jugador a la lista de cercanos...
    addNearestPlayer( gamertag ) {
        this.#world.nearestPlayers.push( gamertag )
    }

    // Remover jugador de la lista de cercanos...
    delNearestPlayer( gamertag ) {
        const index = this.#world.nearestPlayers.indexOf( gamertag )
        this.#world.nearestPlayers.splice(index, 1);
    } 

    // * CALL METHODS

    /**
     * 
     * @param {String} targetPeerId 
     * @description Enviar evento para llamar a un peer especifico...
     */
    Call( targetPeerId ) {
        if( !this.isIncomingCall(targetPeerId) ){
            this.#MySocket.emit('_call_peer', {
                peerID: targetPeerId
            });
            this.addIncomingCall(targetPeerId);
        }
    }

    /**
     * 
     * @param {String} targetPeerId 
     * @description Enviar evento para cerrar llamada con peer en caso de que exista una llamada corriendo...
     */
    CloseCall( targetPeerId ) {
        if( this.isIncomingCall(targetPeerId) ){
            this.#MySocket.emit('_close_call_with_peer',{
                peerID: targetPeerId
            });
        }
    }

    /**
     * @description Expulsar cliente de el servidor de voz...
     */
    Kick() {
        this.#MySocket.emit('kicked_from_server', {} );
    }
    
}