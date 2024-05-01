import { StartPeerServer } from "../PeerServer.js";
import { StartSockerServer } from "../SocketServer.js";
import http from 'http';
import express from 'express';
import { Room } from "./Room.js";
import cors from 'cors'
import colors from 'colors';
import { vc_config } from "../../vchunk.config.js";
import { config } from 'dotenv'
import { WorldData } from "./WorldData.js";
import { Logger } from "../utils/Logger.js";

export class System{
    #password

    constructor( options ) {
        config();
        this._MainRoom = new Room();
        this.worldData = new WorldData();
        this.#password = process.env.ACCESS_TOKEN || "examplepassword"
        this.debugMode = vc_config.debugMode;

        this.StartWorldData();
    }

    /**
     * 
     * @param {String} text 
     * @description Log Message To Console...
     */
    Logger = ( text ) => {
        const currentDate = new Date();
    
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Los meses empiezan en 0
        const year = currentDate.getFullYear();
    
        // Opciones para el formato de hora
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
    
        const timeString = currentDate.toLocaleTimeString('en-US', options);
        
        console.log(`[${month}/${day}/${year} | ${timeString}]: `.cyan + text);
    }

    StartWorldData() {
        // Codigo para obtener la informacion del servidor de minecraft...
        const app = express();
        const port = process.env.PORT || vc_config.port;

        app.use(cors())
        app.use(express.json())

        const theservy = http.createServer(app);

        StartSockerServer(theservy);
        StartPeerServer(theservy, peerServer => {
            app.use("/vcserver", peerServer);
        });

        // Ruta de ejemplo para que el servidor de minecraft mande los datos...
        app.post('/voiceapi', (req, res) => {
            const data = req.body;
            if( data.token != this.#password ) {
                this.debugMode ? this.Logger(`Access denied to: ${req.ip}`.red) : null;
                return;
            };
            this.debugMode ? this.Logger(`Access Allow to: ${req.ip}`.green) : null;

            res.setHeader('Content-Type', 'application/json');
            this.worldData.players = data.players;

            this._MainRoom.proximityUpdate(this.worldData.players);
            //this.Logger(this.worldData.map( p => p.gamertag ));
            res.send({ talking: this._MainRoom.getTalkingClients() });
        });

        // Escuchar en el puerto especificado
        theservy.listen(port, () => {
            this.Logger(`Servidor escuchando en http://localhost:${port}`);
        });
    }
}