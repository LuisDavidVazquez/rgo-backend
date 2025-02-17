const fs = require('fs');
const path = require('path');

// Directorio raíz donde se encuentran tus módulos
const modulesDir = path.join(__dirname, 'src');

console.log(`Directorio de módulos: ${modulesDir}`);

// Función para comentar console.log en el contenido del archivo
const comentarConsoleLogs = (contenido) => {
    // Usa una expresión regular para encontrar y comentar todos los console.log
    const resultado = contenido.replace(/console\.log\((.*?)\);/g, '// console.log($1);');
    return {
        contenidoModificado: resultado,
        cambiosRealizados: contenido !== resultado
    };
};

// Función para recorrer directorios y comentar console.log en archivos
const comentarConsoleLogsEnDir = (dir) => {
    console.log(`Procesando directorio: ${dir}`);
    
    // Lee todos los archivos y directorios en el directorio actual
    fs.readdir(dir, (err, archivos) => {
        if (err) {
            console.error('Error al leer el directorio:', err);
            return;
        }

        console.log(`Archivos encontrados: ${archivos.length}`);

        // Procesa cada archivo o directorio
        archivos.forEach((archivo) => {
            const rutaArchivo = path.join(dir, archivo);

            // Obtiene las estadísticas del archivo o directorio
            fs.stat(rutaArchivo, (err, stats) => {
                if (err) {
                    console.error('Error obteniendo estadísticas del archivo:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    // Si es un directorio, llama recursivamente a la función
                    comentarConsoleLogsEnDir(rutaArchivo);
                } else if (stats.isFile()) {
                    console.log(`Procesando archivo: ${rutaArchivo}`);
                    // Lee el contenido del archivo
                    fs.readFile(rutaArchivo, 'utf8', (err, contenido) => {
                        if (err) {
                            console.error('Error al leer el archivo:', err);
                            return;
                        }

                        // Comenta los console.log en el contenido
                        const { contenidoModificado, cambiosRealizados } = comentarConsoleLogs(contenido);

                        if (cambiosRealizados) {
                            // Si se realizaron cambios, escribe el nuevo contenido en el archivo
                            fs.writeFile(rutaArchivo, contenidoModificado, 'utf8', (err) => {
                                if (err) {
                                    console.error('Error al escribir el archivo:', err);
                                    return;
                                }

                                console.log(`Console.logs comentados en: ${rutaArchivo}`);
                            });
                        } else {
                            console.log(`No se encontraron console.logs para comentar en: ${rutaArchivo}`);
                        }
                    });
                }
            });
        });
    });
};

// Iniciar el proceso de comentar desde el directorio de módulos
console.log('Iniciando proceso de comentar console.logs...');
comentarConsoleLogsEnDir(modulesDir);
