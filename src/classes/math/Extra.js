// Ecuacion -> (max - num) / max - min
export const easyRange = (numero, minimo, maximo) => {
    // Restar el número del máximo para invertir el rango
    var valorInvertido = maximo - numero;

    // Calcular el rango total
    var rangoTotal = maximo - minimo;

    // Convertir el valor invertido al rango 0-1
    var valorEnRango01 = valorInvertido / rangoTotal;

    return valorEnRango01;
}