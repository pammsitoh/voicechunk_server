import colors from 'colors'

export const Logger = ( text ) => {

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