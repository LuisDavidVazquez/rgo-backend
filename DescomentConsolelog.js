const fs = require('fs');
const path = require('path');

// Directorio raíz donde se encuentran tus módulos
const modulesDir = path.join(__dirname, 'src');

console.log(`Directorio de módulos: ${modulesDir}`);

// Función para descomentar console.log en el contenido del archivo
const descomentarConsoleLogs = (contenido) => {
    // Usa una expresión regular para encontrar y descomentar todos los console.log comentados
    const resultado = contenido.replace(/\/\/\s*console\.log\((.*?)\);/g, 'console.log($1);');
    return {
        contenidoModificado: resultado,
        cambiosRealizados: contenido !== resultado
    };
};

// Función para recorrer directorios y descomentar console.log en archivos
const descomentarConsoleLogsEnDir = (dir) => {
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
                    descomentarConsoleLogsEnDir(rutaArchivo);
                } else if (stats.isFile()) {
                    console.log(`Procesando archivo: ${rutaArchivo}`);
                    // Lee el contenido del archivo
                    fs.readFile(rutaArchivo, 'utf8', (err, contenido) => {
                        if (err) {
                            console.error('Error al leer el archivo:', err);
                            return;
                        }

                        // Descomenta los console.log en el contenido
                        const { contenidoModificado, cambiosRealizados } = descomentarConsoleLogs(contenido);

                        if (cambiosRealizados) {
                            // Si se realizaron cambios, escribe el nuevo contenido en el archivo
                            fs.writeFile(rutaArchivo, contenidoModificado, 'utf8', (err) => {
                                if (err) {
                                    console.error('Error al escribir el archivo:', err);
                                    return;
                                }

                                console.log(`Console.logs descomentados en: ${rutaArchivo}`);
                            });
                        } else {
                            console.log(`No se encontraron console.logs comentados para descomentar en: ${rutaArchivo}`);
                        }
                    });
                }
            });
        });
    });
};

// Iniciar el proceso de descomentar desde el directorio de módulos
console.log('Iniciando proceso de descomentar console.logs...');
descomentarConsoleLogsEnDir(modulesDir);
