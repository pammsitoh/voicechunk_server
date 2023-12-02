export class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Método para sumar dos vectores
    add(otherVector) {
        return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    }

    // Método para restar dos vectores
    subtract(otherVector) {
        return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
    }

    // Método para multiplicar el vector por un escalar
    multiplyScalar(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    // Método para calcular el producto punto entre dos vectores
    dotProduct(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z;
    }

    // Método para calcular la magnitud (longitud) del vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // Método para calcular la distancia entre dos vectores
    distanceTo(otherVector) {
        const dx = this.x - otherVector.x;
        const dy = this.y - otherVector.y;
        const dz = this.z - otherVector.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Método para verificar si otro vector está dentro de cierto rango de distancia
    isInRange(otherVector, range) {
        return this.distanceTo(otherVector) <= range;
    }

    // Método para normalizar el vector (hacer que su magnitud sea 1)
    normalize() {
        const mag = this.magnitude();
        if (mag !== 0) {
            return this.multiplyScalar(1 / mag);
        } else {
            // Si el vector tiene magnitud cero, devolvemos un nuevo vector con magnitud cero
            return new Vector3(0, 0, 0);
        }
    }
}
