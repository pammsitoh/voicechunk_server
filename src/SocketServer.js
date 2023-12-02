import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Logger } from './utils/Logger.js';
import { system } from '../index.js';
import { Client } from './classes/Client.js';
import { vc_config } from '../vchunk.config.js';
import { NiceMessages } from './utils/NiceMessages.js';

export const StartSockerServer = ( eapp ) => {
    const io = new Server(eapp, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            Logger('Usuario desconectado');
            // elimina al cliente de la sala
            system._MainRoom.delClientById( socket.id );
        });

        socket.on('new_connection', (data) => {
            // Si Existe Un Cliente Con El Mismo Gamertag Expulsarlo y Detener Conexion...
            if( system._MainRoom.existsClientByGamertag(data.gamertag) || !system.worldData.isConnected(data.gamertag) ){
                socket.emit("kick_from_server", {
                    reason: !system.worldData.isConnected(data.gamertag) ? NiceMessages.player_not_in_server : NiceMessages.client_with_gamertag_already_connected 
                });
                return;
            }

            // Muestra Cuando alguien se ha unido al servidor de voz...
            Logger(`${data.gamertag} se ha unido al servidor de voz con PEERID: ${data.peerID}`.yellow);
            // Agrega al nuevo cliente a la sala de voz...
            system._MainRoom.newClient(new Client(data.gamertag, data.socketID, data.peerID, socket));

            // Muestra los gamertags de los clientes conectados...
            console.log(JSON.stringify(system._MainRoom.getAllClients().map( cl => cl.getGamertag())));
        });

        socket.on('my_voice_state', data => {
            const player = system._MainRoom.getClientById(socket.id);
            if( player == null || undefined ) return;

            if( data.state != player.isTalking() ) {
                player.setTalking(data.state)
            }
        });
    });
};
