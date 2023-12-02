import { PeerServer, ExpressPeerServer } from 'peer'
import { Logger } from './utils/Logger.js';
import { vc_config } from '../vchunk.config.js';

export const StartPeerServer = ( eapp, callback ) => {
    const peer_server = ExpressPeerServer(eapp, {
        debug: true,
        allow_discovery: true,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
    })
    
    peer_server.on('connection', (user) => {
        Logger(`New User: ${user.getId()}`);
    });
    
    peer_server.on('disconnect', (user) => {
        Logger(`User Disconnected: ${user.getId()}`);
    });

    callback(peer_server)
}