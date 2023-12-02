import { Logger } from "./src/utils/Logger.js";
import { StartPeerServer } from "./src/PeerServer.js";
import { StartSockerServer } from "./src/SocketServer.js";
import figlet from 'figlet';
import { World } from "./src/World.js";
import { System } from "./src/classes/System.js";

//Inititialize

figlet.text(
    "VoiceChunk",
    {
        font: "Graffiti",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
    },
    function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.clear();
        console.log(data.magenta + "\n ==< v1.0.0 >==\n\n".magenta);
        Logger("Iniciando Servidor...");
    }
)

export const system = new System();