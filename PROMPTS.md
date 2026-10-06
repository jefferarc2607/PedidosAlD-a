# BITÁCORA DE PROMPTS Y DESARROLLO (PRÁCTICA 1)
**Aplicación:** PEDIDOS AL DÍA  
**Ejercicio:** N.º 30 · Negocio familiar de comida / panadería  
**Alumno:** 3.er año Desarrollo de Software · INDEL · Octubre 2026  

---

### Peldaño P0: Prototipo Mínimo en Consola y Estructura Base
- **Prompt ejecutado:**
  > *"Actúa como programador frontend. Diseña una estructura básica en HTML y JavaScript para registrar pedidos de una panadería familiar. Debe capturar en variables o consola: nombre del cliente, producto, hora de entrega y precio. No uses librerías externas ni estilos complejos todavía."*
- **Respuesta resumida de la IA:**
  Generó un formulario HTML básico con 4 inputs y un script que escuchaba el evento `submit`, prevenía el comportamiento por defecto y hacía un `console.log` del objeto pedido creado en memoria.
- **Lo que se aceptó:**
  La definición de la estructura de datos del objeto `pedido` (`cliente`, `producto`, `hora`, `precio`).
- **Lo que se corrigió a mano:**
  Se modificaron los identificadores a español consistente, se definió el tipo de dato de precio como numérico estricto y se estructuró la fecha para evitar problemas de desfase horario.
- **Archivo de evidencia:** `evidencias/E0-consola.png`
- **Mensaje de commit Git:** `feat(P0): estructura base y prototipo inicial de captura de pedidos` (Hash sugerido: `f3a19b2`)

---

### Peldaño M1: Interfaz Visual y Selector de Estados
- **Prompt ejecutado:**
  > *"Agrega una lista visual de pedidos en el DOM donde cada tarjeta muestre el pedido con su cliente, hora y monto. Agrega un selector o botones para alternar entre 3 estados: Pendiente, Listo y Entregado. Además, calcula y muestra abajo el total acumulado en dinero de los pedidos registrados."*
- **Respuesta resumida de la IA:**
  Generó una función de renderizado `renderPedidos()` que recorría un array en memoria, creaba elementos con `innerHTML` e incluía botones para cambiar el estado y un `reduce()` para sumar el precio acumulado.
- **Lo que se aceptó:**
  El cálculo del total con `reduce()` y el ciclo de vida de los estados (Pendiente ➔ Listo ➔ Entregado).
- **Lo que se corrigió a mano:**
  Se separó el cálculo financiero entre "Total del día", "Por cobrar" y "Ya cobrado", para que el dueño sepa exactamente cuánto dinero tiene en mano y cuánto resta ingresar.
- **Archivo de evidencia:** `evidencias/E1-despues.png`
- **Mensaje de commit Git:** `feat(M1): renderizado de tarjetas, flujo de 3 estados y balance acumulado` (Hash sugerido: `b8e402c`)

---

### Peldaño M2: Persistencia con LocalStorage
- **Prompt ejecutado:**
  > *"Haz que los pedidos persistan en el navegador usando localStorage. Al cargar la página deben leerse los pedidos guardados; al agregar, editar el estado o eliminar un pedido debe sincronizarse automáticamente el almacenamiento para que no se pierdan al recargar."*
- **Respuesta resumida de la IA:**
  Implementó dos funciones utilitarias `guardarEnStorage()` y `cargarDeStorage()` usando `JSON.stringify()` y `JSON.parse()`, integrándolas en los puntos de mutación del array.
- **Lo que se aceptó:**
  La lógica de serialización y deserialización automática.
- **Lo que se corrigió a mano:**
  La IA no había contemplado el caso de `localStorage` corrupto o nulo en primera visita. Se envolvió la lectura en un bloque `try/catch` robusto y se agregaron 4 pedidos semilla reales de panadería para que un usuario nuevo no vea una pantalla rota o vacía.
- **Archivo de evidencia:** `evidencias/E2-storage.png`
- **Mensaje de commit Git:** `feat(M2): persistencia en localStorage con manejo seguro de excepciones` (Hash sugerido: `7c20d41`)

---

### Peldaño M3: Experiencia Móvil First y Estado Vacío
- **Prompt ejecutado:**
  > *"Adapta el diseño para que sea Mobile-First, pensado para una persona que atiende en una panadería con una mano en el mostrador. Los botones deben tener al menos 44px de área táctil, tipografía legible y colores cálidos acordes al rubro panadería/comida. Diseña un Estado Vacío visualmente amigable cuando no haya pedidos."*
- **Respuesta resumida de la IA:**
  Entregó un conjunto de estilos CSS responsivos con flexbox y media queries para 375px y 420px, un componente de 'Empty State' con ícono SVG y mensaje motivador, y paleta con tonos ámbar y tierra.
- **Lo que se aceptó:**
  La estética de tonos cálidos (ámbar, café, piedra) y el diseño de la tarjeta de estado vacío con botón de acción directa.
- **Lo que se corrigió a mano:**
  Se ajustaron los márgenes y se agregó una barra fija superior (`sticky header`) y pestañas ergonómicas en la parte inferior/central para que el pulgar llegue fácilmente sin forzar la mano.
- **Archivo de evidencia:** `evidencias/E3-celular.png`
- **Mensaje de commit Git:** `style(M3): interfaz mobile-first ergonomica, paleta artesanal y estado vacio` (Hash sugerido: `e51f890`)

---

### Peldaño M4: Validaciones, Robustez y Prevención de Errores
- **Prompt ejecutado:**
  > *"Revisa el código para hacerlo a prueba de fallos: bloquea campos vacíos, no permitas precios negativos ni letras en el importe, sanitiza las entradas contra inyección XSS si alguien escribe etiquetas HTML, y previene el doble clic accidental al guardar."*
- **Respuesta resumida de la IA:**
  Escribió una función de sanitización con reemplazo de caracteres HTML (`&`, `<`, `>`, `"`, `'`), validaciones condicionales con mensajes de error visuales y el atributo `disabled` temporal en el botón de guardar.
- **Lo que se aceptó:**
  La sanitización de texto y la lógica de validación previa al guardado.
- **Lo que se corrigió a mano:**
  Se mejoró el parseo de precios: en Argentina y países vecinos los usuarios escriben comas o puntos indistintamente (ej. `1.500` o `1500,50` o `$2500`). Se programó una expresión regular que remueve símbolos y normaliza comas a puntos decimales sin arrojar `NaN`.
- **Archivo de evidencia:** `evidencias/E4-validaciones.png`
- **Mensaje de commit Git:** `fix(M4): validaciones estrictas, sanitizacion anti-XSS y debounce en formularios` (Hash sugerido: `3a9d714`)

---

### Peldaño M5: Inteligencia Artificial con Gemini API (Structured JSON)
- **Prompt ejecutado:**
  > *"Integra la API de Google Gemini (modelo gemini-2.5-flash) mediante llamada REST directa con fetch. Debe recibir un esquema estructurado (responseSchema en formato JSON) para cumplir dos tareas: 1) Redactar un mensaje cordial de confirmación para WhatsApp al cliente y 2) Generar el parte consolidado de producción de panadería para el día siguiente. Si no hay API key o no hay internet, debe activar un fallback automático sin romper la consola."*
- **Respuesta resumida de la IA:**
  Generó la función `callGeminiApi()` apuntando al endpoint de Google AI Studio, enviando `generationConfig.responseMimeType = "application/json"` con `responseSchema`, procesando la respuesta con `JSON.parse` y estructurando el bloque de contingencia local.
- **Lo que se aceptó:**
  La estructura de la petición REST moderna y el esquema JSON estructurado con campos tipados.
- **Lo que se corrigió a mano:**
  Se incorporó un modal seguro para que el usuario guarde o cambie su propia API key sin exponerla en el código fuente, y se pulieron las plantillas del fallback para que los mensajes generados en modo sin conexión tengan la misma calidez y exactitud que los de la IA.
- **Archivo de evidencia:** `evidencias/E5-app.png`
- **Mensaje de commit Git:** `feat(M5): integracion gemini 2.5 flash con esquema estructurado y fallback local` (Hash sugerido: `9d48e65`)

---

## Cierre y Reflexión Técnica

1. **Total de prompts ejecutados:**  
   Se ejecutaron **6 prompts principales** correspondientes a los 6 peldaños metodológicos, complementados por 4 repreguntas de ajuste fino (CSS y normalización de moneda).

2. **El prompt más útil:**  
   El del **Peldaño M5 (Inteligencia Artificial con Structured JSON)**. Al especificarle exactamente el modelo (`gemini-2.5-flash`), el endpoint REST v1beta y el requisito de `responseSchema` en JSON estricto, la IA generó el payload exacto sin alucinar con SDKs pesados que no corrían en un solo archivo HTML.

3. **El error más caro:**  
   El manejo de fechas con `new Date().toISOString()`. La IA propuso esa solución estándar en el Peldaño M1, pero en el huso horario local (-3 GMT), las pruebas realizadas después de las 21:00 hs asignaban los pedidos al día siguiente automáticamente. Detectar y corregir esta discrepancia temporal requirió refactorizar el helper de fechas a componentes locales (`getFullYear`, `getMonth`, `getDate`).

4. **Qué haría distinto en una próxima versión:**  
   Implementaría desde el primer día una arquitectura de eventos desacoplada y un mini-almacén de estado tipo Store reactivo nativo antes de escribir el HTML, lo que habría simplificado el refresco de las tres pestañas (Hoy, Cerrados y Resumen) sin necesidad de re-renderizados manuales del DOM.
