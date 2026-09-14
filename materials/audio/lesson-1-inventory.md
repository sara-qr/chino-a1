# Audios reales de Lesson 1

Inspección: 11 de septiembre de 2026. En `materials/audio/` se recibieron carpetas ya descomprimidas, no archivos ZIP. No se puede verificar el nombre original de los ZIP. La procedencia comprobable es `HSK 1 Tb audios/` (Textbook) y `HSK 1 wb audios/` (Workbook).

Método: listado real de archivos, duración y metadatos con ffprobe, e inspección de las locuciones mediante transcripción automática local con whisper-cli. Los MP3 no contienen etiquetas de título. Las transcripciones automáticas sirven para identificar instrucciones y secciones; no se usan como solucionario de tonos ni como transcripción exacta de las sílabas. No se han instalado dependencias en el proyecto ni añadido reconocimiento de voz a la aplicación.

| Carpeta | Archivo original | Duración | Contenido identificado | Uso en Sesión 1 |
| --- | --- | --- | --- | --- |
| HSK 1 Tb audios | 01-1.mp3 | 26,34 s | Presentación de Lesson 1, Text 1: 你好 / 你好; New Words: 你, 好 | Pronuncia: escucha y repetición del saludo completo |
| HSK 1 Tb audios | 01-2.mp3 | 17,87 s | Text 2: 您好 / 你们好 y vocabulario | Excluido: expresiones no enseñadas en esta sesión |
| HSK 1 Tb audios | 01-3.mp3 | 18,96 s | Text 3: 对不起 / 没关系 y vocabulario | Excluido: expresiones no enseñadas en esta sesión |
| HSK 1 Tb audios | 01-4.mp3 | 82,19 s | Iniciales y finales, grupo 1 | Excluido: inventario fonético aún no trabajado |
| HSK 1 Tb audios | 01-5.mp3 | 75,77 s | Lectura de sílabas prestando atención a los tonos | No copiado: se selecciona el listening específico de tonos del Workbook |
| HSK 1 Tb audios | 01-6.mp3 | 42,10 s | Lectura de palabras monosílabas con imágenes | Excluido: requiere imágenes no disponibles en la sesión |
| HSK 1 Tb audios | 01-7.mp3 | 35,99 s | Lectura de palabras bisílabas con imágenes | Excluido: requiere imágenes y vocabulario adicional |
| HSK 1 Tb audios | 01-8.mp3 | 51,75 s | Lectura de palabras y cambio del tercer tono | No copiado: incluye una lista más amplia; no es audio aislado de 你好 |
| HSK 1 Tb audios | 01-9.mp3 | 23,78 s | Expresiones de clase | Excluido: vocabulario adicional |
| HSK 1 wb audios | 01-1.mp3 | 108,17 s | Ejercicio 1: lectura de palabras monosílabas | No copiado: se selecciona el ejercicio específico de identificación de tonos |
| HSK 1 wb audios | 01-2.mp3 | 72,15 s | Ejercicio 2: lectura de palabras bisílabas | Excluido: práctica más amplia |
| HSK 1 wb audios | 01-3.mp3 | 169,35 s | Ejercicio 4: escuchar y escribir iniciales | Excluido: iniciales aún no trabajadas |
| HSK 1 wb audios | 01-4.mp3 | 161,31 s | Escuchar y escribir finales | Excluido: finales aún no trabajadas |
| HSK 1 wb audios | 01-5.mp3 | 172,56 s | Ejercicio 6: escuchar, escribir tonos y leer; 20 elementos numerados | Practica: listening de tonos, anotación en papel y repetición, sin puntuación automática |

## Copias publicadas localmente

- `HSK 1 Tb audios/01-1.mp3` → `public/audio/lesson-1/textbook-01-1.mp3`.
- `HSK 1 wb audios/01-5.mp3` → `public/audio/lesson-1/workbook-01-5.mp3`.

Las copias conservan íntegramente los bytes originales. Los prefijos evitan colisiones de nombres entre libros. No se han encontrado archivos individuales identificados como 你, 好 o 你好. La primera pista del Textbook contiene diálogo y vocabulario juntos: no se ha recortado ni presentado como tres audios separados.

La actividad del Workbook adapta su consigna a una lista en papel; no reproduce páginas ni inventa correspondencias con opciones, imágenes o respuestas. Se practica el reconocimiento de los cuatro tonos ya introducidos, sin exigir el significado de las palabras.
