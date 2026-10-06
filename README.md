# PEDIDOS AL DÍA
> Sistema ágil de captura de pedidos, control de estados y resúmenes diarios para negocios familiares de panadería y comida casera.

---

## 1. Probala ahora
- **URL pública en GitHub Pages**: [https://torretamansito.github.io/pedidos-al-dia/](https://torretamansito.github.io/pedidos-al-dia/)
- **Acceso rápido desde celular**: Escaneá el código QR ubicado en el repositorio en `docs/qr.png` para abrir la aplicación directamente en el navegador de cualquier teléfono móvil (Chrome, Safari, Firefox) sin necesidad de instalar nada desde tiendas de aplicaciones.
- **Modo sin conexión / Local**: Funciona 100% en el dispositivo mediante almacenamiento local seguro (`localStorage`), garantizando que no se pierdan los pedidos aunque se cierre el navegador o se corte la conexión.

---

## 2. Capturas de pantalla y evidencias

| Vista Móvil en Celular (375px) | Antes y Después de la carga | Resumen y Asistente de IA (Gemini) |
| :---: | :---: | :---: |
| ![Vista Celular](evidencias/E3-celular.png) | ![Antes y Después](evidencias/E1-despues.png) | ![Generador IA](evidencias/E5-app.png) |
| *Captura en pantalla táctil con botones ergonómicos de un toque* | *Flujo de estados: Pendiente ➔ Listo ➔ Entregado* | *Redacción automática de WhatsApp y producción para cocina* |

---

## 3. Qué hace la aplicación
1. **Captura inmediata de pedidos**: Registra en menos de 10 segundos el nombre del cliente, teléfono/WhatsApp, detalle de los productos, hora pactada de entrega y el precio total a cobrar, evitando que los pedidos se traspapelen entre conversaciones de mensajería.
2. **Flujo de estados en 1 toque**: Permite mover cada orden entre **Pendiente** (en elaboración), **Listo** (empaquetado para retiro/envío) y **Entregado** (cobrado y cerrado) con áreas táctiles adaptadas para manos en la cocina.
3. **Cierre de caja y Asistente inteligente de producción (Gemini)**: Calcula al instante el total a cobrar del día desglosando lo cobrado de lo pendiente. Además, redacta mensajes cordiales de confirmación listos para enviar por WhatsApp y consolida el parte de producción para el horneado del día siguiente.

---

## 4. Cómo correrlo en tu máquina

### Requisitos previos
- Navegador web moderno (Google Chrome, Firefox, Safari o Microsoft Edge).
- Git y Python 3 (o cualquier servidor local de estáticos).

### Pasos de ejecución
```bash
# 1. Clonar el repositorio
git clone https://github.com/torretamansito/pedidos-al-dia.git

# 2. Entrar a la carpeta del proyecto
cd pedidos-al-dia

# 3. Iniciar un servidor HTTP local ligero (evita bloqueos de CORS en módulos y storage)
python3 -m http.server 8000

# 4. Abrir en tu navegador
# http://localhost:8000
```

### Configuración de la API Key de Gemini (Opcional para IA)
La aplicación cuenta con un botón en la esquina superior (**⚙️ Configurar Gemini API**) donde podés ingresar tu API Key gratuita de Google AI Studio. 
- La clave se guarda de manera segura en tu propio navegador (`localStorage`).
- **Respaldo sin clave (Fallback)**: Si no ingresás ninguna clave o no tenés internet, el sistema activa automáticamente un motor de plantillas determinísticas para que la redacción de mensajes y el parte de producción sigan funcionando sin trabas.

---

## 5. Tecnologías utilizadas
- **HTML5 Semántico**: Estructura accesible (`main`, `section`, `article`, diálogos modales nativos con `aria-*`).
- **CSS3 Moderno**: Diseño Mobile-First fluido con Flexbox, CSS Grid, variables CSS (Custom Properties) para temas cálidos de panadería artesanal y media queries desde 320px.
- **JavaScript Vanilla (ES2022)**: Manipulación nativa del DOM, validaciones sanitizadas, ordenamiento cronológico y manejo asíncrono con `async/await`.
- **LocalStorage API**: Persistencia local en cliente sin necesidad de servidor ni costos de infraestructura.
- **Google Gemini API (`gemini-2.5-flash`)**: Integración REST con esquema de respuesta estructurado (`responseSchema` JSON) para redacción contextual de mensajes de WhatsApp y consolidación de recetas/pedidos.

---

## 6. La escalera de mejoras (Bitácora de desarrollo)

| Peldaño | Descripción del Cambio | Hash de Commit | Archivo de Evidencia |
| :--- | :--- | :--- | :--- |
| **P0** | Prototipo inicial en consola y estructura HTML básica con campos de cliente, producto y hora. | `f3a19b2` | `evidencias/E0-consola.png` |
| **M1** | Interfaz visual interactiva con lista de pedidos, selector de 3 estados y cálculo dinámico de total acumulado. | `b8e402c` | `evidencias/E1-despues.png` |
| **M2** | Persistencia completa con `localStorage` (CRUD: guardar, listar, cambiar estado y eliminar con persistencia al recargar). | `7c20d41` | `evidencias/E2-storage.png` |
| **M3** | Rediseño Mobile-First adaptado a celulares (320px+), tarjetas táctiles $\ge 44\text{px}$ y estado vacío ilustrado y empático. | `e51f890` | `evidencias/E3-celular.png` |
| **M4** | Blindaje contra errores: bloqueo de campos en blanco, prevención de precios negativos, sanitización anti-XSS y bloqueo de doble clic. | `3a9d714` | `evidencias/E4-validaciones.png` |
| **M5** | Integración de IA con Gemini 2.5 Flash: generación de mensajes de confirmación para WhatsApp, resumen de producción y fallback offline. | `9d48e65` | `evidencias/E5-app.png` |

---

## 7. Prueba con usuarios reales

Para validar la usabilidad en un contexto de atención rápida, se llevaron a cabo pruebas observacionales con 3 perfiles distintos:

| Perfil de Usuario | Tarea asignada | Frase textual / Reacción | Traba observada | Solución implementada |
| :--- | :--- | :--- | :--- | :--- |
| **1. Compañero de clase** (Estudiante de software) | Cargar un pedido y cambiarlo de estado rápidamente. | *"Está bueno que con un solo botón pasa de Listo a Entregado sin tener que abrir otro menú."* | Intentó hacer doble clic rápido en 'Guardar' por costumbre y temía duplicar la orden. | Se agregó bloqueo de botón (`disabled`) durante el procesamiento para evitar registros duplicados. |
| **2. Adulto del centro / Familiar** (Atiende mostrador de comida) | Registrar un pedido urgente recibido por WhatsApp y revisar cuánto hay que cobrar. | *"A veces me pasan el precio con signo peso o con coma y se me trababa la calculadora."* | Escribió `$ 4.500,00` y en la primera versión se rompía el cálculo del total. | Se creó una función de sanitización que limpia signos `$`, espacios y puntos de miles antes de convertir a número. |
| **3. Persona ajena** (Cliente de panadería) | Leer el mensaje de confirmación que le enviaría la panadería. | *"El mensaje tiene todo claro: lo que pedí, a qué hora pasar y cuánto tengo que pagar."* | Preguntó si se podía modificar el texto antes de enviarlo por si quería aclarar si llevaba cambio. | Se transformó el texto generado en un área editable previa al envío por WhatsApp o copiado. |

### Dos hallazgos principales corregidos:
1. **Confusión horaria en horarios nocturnos**: El cálculo de "Hoy" usando `.toISOString()` cambiaba de fecha a partir de las 21:00 hs por el huso horario UTC. Se corrigió utilizando constructores de fecha en hora local (`getFullYear()`, `getMonth()`, `getDate()`).
2. **Acceso directo a WhatsApp**: Los usuarios no querían copiar manualmente el número. Se incorporó generación de enlace dinámico con protocolo `https://wa.me/` sanitizando guiones y espacios.

---

## 8. Declaración de uso de Inteligencia Artificial
- **Herramienta utilizada**: Google Gemini (modelos Gemini 2.5 Flash y Claude 3.5 Sonnet para pair-programming).
- **Qué hizo la IA**: Sugirió la estructura inicial del layout responsivo, generó los prompts de sistema con `responseSchema` en JSON para la API de Gemini y redactó los casos de prueba de borde para validación de montos.
- **Qué hice yo**: Diseñé la arquitectura del flujo de datos en cliente, definí los puntos críticos donde un operador se equivoca en cocina, estructuré la persistencia con `localStorage` y programé los interceptores de fallos (fallback).
- **Qué verifiqué**: Comprobé manualmente en Chrome DevTools que ninguna consulta a la API bloqueara la interfaz (`async/await`), audité la respuesta JSON tipada de Gemini contra el esquema exigido y verifiqué la ausencia de errores en consola.
- **Qué corregí**: Reemplacé el uso de alertas nativas (`alert()` / `confirm()` bloqueantes) por modales accesibles y corregí la fórmula de parseo de precios para admitir formatos argentinos y latinoamericanos.

---

## 9. Tarjeta anti-alucinación

| # | Afirmación o Código provisto por la IA | Documentación Oficial Verificada | Veredicto y Ajuste |
| :---: | :--- | :--- | :--- |
| **1** | *"Podés usar `response_mime_type: 'application/json'` y pasar un JSON Schema estándar en `response_schema` en la llamada REST de Gemini v1beta."* | [Google AI for Developers - Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-outputs) | **Verdadero**. Se confirmó que la API REST v1beta soporta `responseSchema` dentro de `generationConfig` para forzar JSON estricto. |
| **2** | *"Para formatear números como pesos argentinos usá `amount.toLocaleString('es-AR')` directo sin opciones."* | [MDN Web Docs - Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) | **Incompleto**. En navegadores móviles desactualizados puede devolver solo el número sin el símbolo. Se reforzó con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })`. |
| **3** | *"El evento `localStorage.setItem()` se ejecuta de forma asíncrona si el objeto es muy grande."* | [MDN Web Docs - Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem) | **Falso**. `localStorage` es estrictamente sincrónico y bloqueante del hilo principal. Se mantuvo el guardado eficiente con objetos ligeros y captura de cuota con `try/catch`. |

---

## 10. Limitaciones conocidas
1. **Ámbito de dispositivo único**: Al usar `localStorage`, los pedidos cargados en un celular no se sincronizan automáticamente con la tablet de la cuadra o de otro empleado (requiere backend o base de datos en tiempo real como Firestore).
2. **Dependencia de conectividad para funciones IA**: Si bien la app funciona sin internet gracias a los fallbacks simulados, la generación con Gemini requiere conexión a internet y una API key válida.
3. **No imprime tickets térmicos**: No incluye conexión por Bluetooth o USB a comandera física de 58mm/80mm (se diseñó para compartir por pantalla o WhatsApp).

---

## 11. Próximos pasos (Mejoras para una semana extra)
1. **Sincronización multi-dispositivo**: Integrar Firebase Cloud Firestore o WebSockets para que el mostrador y la cuadra de horneado vean los pedidos en tiempo real simultáneamente.
2. **Exportación e importación en Excel/CSV**: Permitir descargar el historial mensual de ventas para análisis contable o respaldar datos en caso de cambio de teléfono.
3. **Módulo de recordatorio automático**: Notificación visual o alarma cuando falten 15 minutos para la hora de entrega pactada de un pedido que aún figure en estado "Pendiente".

---

## 12. Autor
- **Carrera**: Tecnicatura Superior en Desarrollo de Software (3.er año).
- **Institución**: INDEL.
- **Fecha**: Octubre de 2026.
- **Contacto**: `torretamansito@gmail.com`

---

## 13. Licencia
Este proyecto se distribuye bajo la licencia de código abierto **MIT License**. Podés utilizarlo, adaptarlo y distribuirlo libremente para negocios comerciales o proyectos educativos.
