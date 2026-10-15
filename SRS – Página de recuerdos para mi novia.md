# SRS – Página de recuerdos para mi novia

**Documento de especificación de requerimientos de software** Versión 1.1 · Octubre 2026 · Autor: Lucas

---

## 1. Introducción

### 1.1 Propósito

Este documento define los requerimientos de una página web personal, pensada como regalo para Nerea, mi novia. La página es un lugar compartido donde ella pueda entrar, recordar cuánto la amo y, además, guardar entre los dos las cosas que vamos viviendo: planes que queremos hacer juntos y opiniones de los lugares donde vamos a comer, merendar o desayunar.

### 1.2 Alcance

Se trata de una aplicación web de uso privado (dos personas) con:

- Una pantalla romántica interactiva de bienvenida.
- Una lista compartida de cosas, lugares y compras que queremos hacer juntos.
- Un diario de reseñas de lugares gastronómicos.
- Una galería/espacios con nuestras fotos.
- Un juego de ranas escondidas distribuidas por todas las secciones.
- Un backend en Supabase para persistir los datos cargados.

Quedan fuera del alcance de esta primera versión: aplicación móvil nativa, monetización, usuarios públicos y cualquier función social hacia terceros.

### 1.3 Definiciones

| Término | Significado |
| --- | --- |
| Sección | Cada "página" navegable del sitio (Inicio, Deseos, Reseñas, etc.) |
| Rana escondida | Elemento decorativo clickeable oculto en una sección, que se puede encontrar y se registra como hallada |
| Supabase | Plataforma de backend (base de datos PostgreSQL, autenticación y almacenamiento) |
| Reseña | Opinión de un lugar de comida/merienda/desayuno cargada por alguno de los dos |

### 1.4 Usuarios

Solo dos usuarios: **Lucas** (administrador y creador, color negro) y **Nerea** (apodo "Porfiada", color lila). Ambos pueden leer y escribir contenido. No hay otros roles.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

Sitio web de una sola aplicación (SPA o multipágina), con navegación entre secciones que se comportan como páginas independientes. Frontend web responsive y backend en Supabase.

### 2.2 Experiencia buscada

La página tiene que sentirse como un rincón íntimo: tranquila, linda, con detalles que sorprendan. Lo primero que ve ella al entrar es un mensaje de amor. Después, el sitio se convierte en una herramienta cotidiana y afectuosa para nosotros.

### 2.3 Supuestos y dependencias

- Se usará un proyecto de Supabase propio.
- Las fotos las aporto yo y se cargan en el sitio (o en el almacenamiento de Supabase).
- Se accede principalmente desde el celular, aunque también debe funcionar bien en escritorio.
- Hace falta algún tipo de acceso restringido para que el contenido sea solo nuestro (ver sección 6).

---

## 3. Diseño visual

### 3.1 Estilo general

- Moderno y elegante, con mucho aire entre elementos y tipografías suaves.
- Estética tranquila, que invite a quedarse.

### 3.2 Paleta de colores

- **Principal:** lila pastel.
- **Secundario:** crema.
- Acentos suaves en tonos pastel (rosa o verde menta) solo cuando hagan falta, por ejemplo en las ranas o en los corazones.
- Texto con buen contraste sobre los fondos pastel, para que se lea bien.

### 3.3 Fotos nuestras

- Debe haber espacios destinados a nuestras fotos (marcos, collage o tarjetas) en varias secciones, sobre todo en el Inicio.
- Las fotos deben poder reemplazarse sin tocar código, idealmente subiéndolas desde el sitio.

### 3.4 Ranas

Las ranas son el motivo decorativo recurrente del sitio (ver requerimientos funcionales de la sección 4.5).

### 3.5 Animaciones

Transiciones suaves entre secciones y animaciones sutiles (flotar, aparecer, latir). Nada que moleste o ralentice.

---

## 4. Requerimientos funcionales

### 4.1 Navegación general

- **RF-01.** El sitio tendrá un menú de navegación visible en todas las secciones, que permita pasar de una sección a otra.
- **RF-02.** Cada sección funcionará como una página aparte, con su propia dirección (URL), de modo que se pueda volver atrás con el botón del navegador.
- **RF-03.** El menú indicará cuál es la sección actual.
- **RF-04.** En celular, el menú será compacto (barra inferior o menú desplegable).

### 4.2 Sección 1 – Inicio: "¿Tú me amas?"

Lugar tranquilo, es lo primero que ve ella al entrar.

- **RF-05.** Mostrará un cartel central con el texto **"Te amo"** y debajo la pregunta **"¿Tú me amas?"**.
- **RF-06.** Habrá dos botones: **Sí** y **No**.
- **RF-07.** El botón **No** no se podrá presionar: cada vez que ella intente tocarlo (o acercar el cursor/dedo), el botón se moverá a otra posición aleatoria de la pantalla, siempre dentro del área visible.
- **RF-08.** El movimiento del botón No debe funcionar tanto con mouse (al pasar por encima) como con pantalla táctil (al tocar), y no debe poder quedar fuera de la pantalla ni tapado por otros elementos.
- **RF-09.** Al tocar **Sí**, la pantalla mostrará un mensaje gigante: **"TE AMO MÁS"**, acompañado de una lluvia o explosión de muchos corazones animados. Debajo aparecerá el mensaje final: "TE AMO MAS HERMOSA LINDA DE MI CORAZON TE AMO CON TODO MI SERR!!"
- **RF-10.** Tras la animación, se mostrará un acceso claro para continuar hacia el resto de las secciones.
- **RF-11.** La sección incluirá espacios con nuestras fotos y un fondo sereno en lila y crema.
- **RF-12.** (Opcional) Un contador de tiempo juntos o una frase fija de recuerdo, como detalle romántico.

### 4.3 Sección 2 – Nuestros planes (lugares, cosas y compras)

Lista compartida de cosas que nos gustaría hacer juntos.

- **RF-13.** Se podrán **crear, ver, editar y eliminar** ítems.
- **RF-14.** Cada ítem tendrá como mínimo: título, tipo (**lugar**, **cosa para hacer** o **compra**), y una nota o descripción opcional.
- **RF-15.** Se podrá marcar un ítem como **cumplido**, y los cumplidos se verán diferenciados (por ejemplo, tachados o en otra pestaña).
- **RF-16.** Los ítems se guardarán en Supabase y ambos veremos los mismos datos.
- **RF-17.** Se podrá filtrar por tipo y por estado (pendiente / cumplido).
- **RF-18.** Se registrará quién agregó cada ítem y la fecha.
- **RF-19.** (Opcional) Adjuntar una foto o un enlace al ítem.

### 4.4 Sección 3 – Reseñas (comer, merendar, desayunar)

Diario de opiniones de los lugares donde vamos.

- **RF-20.** Se podrá **crear, ver, editar y eliminar** reseñas.
- **RF-21.** Cada reseña tendrá como mínimo: **nombre del lugar**, categoría (**desayuno**, **merienda**, **almuerzo/cena** u otra), **puntuación** (por ejemplo, de 1 a 5), **comentario** y **fecha de la visita**.
- **RF-22.** Cada reseña incluirá además: qué pedimos, precio aproximado y si volveríamos. *(Se podrán sumar más campos en el futuro.)*
- **RF-23.** Cada uno podrá dejar su propia opinión sobre el mismo lugar, de modo que se vean las dos puntuaciones.
- **RF-24.** Se podrán listar las reseñas ordenadas por fecha o por puntuación y filtrarlas por categoría.
- **RF-25.** (Opcional) Adjuntar fotos a la reseña.
- **RF-26.** La sección debe diseñarse de forma modular para poder sumar en el futuro otros tipos de opinión (por ejemplo, películas, viajes o series) sin rehacer el sitio.

### 4.5 Ranas escondidas (transversal a todas las secciones)

- **RF-27.** En **todas** las secciones habrá ranas escondidas en distintos lugares (esquinas, detrás de textos, entre las fotos, dentro de tarjetas, etc.).
- **RF-28.** Las ranas serán clickeables; al hacer click aparecerá una pequeña animación o mensaje tierno y la rana quedará marcada como **encontrada**.
- **RF-29.** Habrá un contador visible y discreto del tipo **"Ranas encontradas: X de 30"**, con las 30 ranas repartidas entre todas las secciones.
- **RF-30.** El progreso se guardará en Supabase para que no se pierda al cerrar el navegador ni al cambiar de dispositivo.
- **RF-31.** Al encontrar las 30 ranas se mostrará el premio final: un cupón cuyo contenido elige Lucas. *(Falta definir qué cupón será.)*
- **RF-32.** Las ranas deben estar bien escondidas pero ser realmente encontrables: ninguna puede quedar inaccesible en ningún tamaño de pantalla.
- **RF-33.** Las posiciones y la cantidad de ranas por sección deben poder configurarse fácilmente sin reescribir las secciones.

### 4.6 Fotos y galería

- **RF-34.** Las fotos mostradas en el sitio se cargarán desde Supabase Storage o desde archivos del proyecto.
- **RF-35.** Se usarán 5 fotos en total, ubicadas en lugares poco intrusivos que no molesten al contenido pero que luzcan muy bien (marcos redondeados, polaroids o collage), repartidas entre el Inicio y las demás secciones.
- **RF-36.** (Opcional) Una sección o bloque de galería con nuestros mejores recuerdos, con título y fecha por foto.

### 4.7 Identidad de las personas

- **RF-37.** Las dos personas se identifican por nombre: **Nerea** (apodo "Porfiada") y **Lucas**.
- **RF-38.** Cada persona tiene un color propio: **lila** para Nerea y **negro** para Lucas. Lo que cada uno carga (planes, reseñas) se muestra con su nombre y su color.

---

## 5. Modelo de datos (Supabase)

Propuesta inicial de tablas en PostgreSQL:

**`wishes`** (Sección 2)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | clave primaria |
| title | text | obligatorio |
| kind | text | lugar / cosa / compra |
| notes | text | opcional |
| done | boolean | por defecto false |
| created\_by | uuid | usuario que lo creó |
| created\_at | timestamptz | automático |

**`reviews`** (Sección 3)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | clave primaria |
| place\_name | text | obligatorio |
| category | text | desayuno / merienda / almuerzo-cena / otra |
| rating | smallint | 1 a 5 |
| comment | text | opcional |
| items\_ordered | text | qué pedimos |
| price\_approx | numeric | precio aproximado |
| would\_return | boolean | si volveríamos |
| visited\_at | date | fecha de la visita |
| author | uuid | quién escribió la reseña |
| created\_at | timestamptz | automático |

**`frogs_found`** (Ranas)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | clave primaria |
| frog\_key | text | identificador único de cada rana |
| user\_id | uuid | quién la encontró |
| found\_at | timestamptz | automático |

**`photos`** (opcional, galería)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | clave primaria |
| path | text | ruta en Supabase Storage |
| caption | text | opcional |
| taken\_at | date | opcional |

**`profiles`** (Nerea y Lucas)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | igual al usuario de Supabase Auth |
| display\_name | text | Nerea / Lucas |
| nickname | text | opcional; "Porfiada" para Nerea |
| color | text | lila (Nerea) / negro (Lucas) |

---

## 6. Requerimientos no funcionales

### 6.1 Seguridad y privacidad

- **RNF-01.** El contenido es privado: solo podemos entrar los dos. Se propone autenticación de Supabase con dos cuentas (email y contraseña, o enlace mágico).
- **RNF-02.** Se activará Row Level Security en todas las tablas, con políticas que permitan leer y escribir solo a los dos usuarios autorizados.
- **RNF-03.** Las claves de Supabase expuestas en el frontend serán únicamente la pública (anon); ninguna clave de servicio debe quedar en el código del cliente.
- **RNF-04.** El bucket de fotos será privado o con acceso restringido.

### 6.2 Usabilidad

- **RNF-05.** Interfaz en español, con tono cariñoso.
- **RNF-06.** Pensada primero para celular (diseño *mobile-first*) y adaptada a escritorio.
- **RNF-07.** Tamaños de botones y textos cómodos para el uso táctil; contraste suficiente sobre los colores pastel.

### 6.3 Rendimiento

- **RNF-08.** Carga inicial rápida; las fotos deberán optimizarse (tamaño y formato) para no ralentizar el sitio.
- **RNF-09.** Las animaciones de corazones deben ser fluidas incluso en celulares modestos.

### 6.4 Compatibilidad

- **RNF-10.** Funcionamiento correcto en las versiones recientes de Chrome, Safari, Firefox y Edge, tanto en Android como en iOS.

### 6.5 Mantenibilidad

- **RNF-11.** Código organizado por secciones, para poder agregar nuevas fácilmente.
- **RNF-12.** Textos, paleta de colores y cantidad de ranas centralizados en archivos de configuración.

### 6.6 Despliegue

- **RNF-13.** El sitio se publicará en un hosting estático o de frontend (por ejemplo, Vercel, Netlify o GitHub Pages), conectado a Supabase.

---

## 7. Criterios de aceptación

1. Al abrir el sitio, se ve el cartel "Te amo / ¿Tú me amas?" con los botones Sí y No.
2. El botón No nunca puede presionarse: se mueve cada vez que se intenta tocar, tanto en celular como en escritorio.
3. Al tocar Sí aparece "TE AMO MÁS" en gigante con muchos corazones animados y el mensaje final de Lucas debajo.
4. Se puede navegar entre las tres secciones y cada una tiene su propia dirección.
5. En la sección de planes se puede crear, editar, marcar como cumplido y eliminar ítems, y ambos vemos los mismos datos.
6. En la sección de reseñas se puede cargar una reseña con nombre del lugar, categoría, puntuación y comentario, junto con qué pedimos, precio aproximado y si volveríamos, y queda guardada en Supabase.
7. Hay 30 ranas escondidas repartidas por todas las secciones, se pueden encontrar haciendo click, el progreso se conserva al volver a entrar y al encontrar las 30 aparece el cupón.
8. El diseño usa lila y crema como colores base y muestra 5 fotos nuestras en lugares discretos pero lindos.
9. Solo las dos cuentas autorizadas pueden ver y modificar los datos, y cada contenido se muestra con el nombre y el color de quien lo cargó.

---

## 8. Ideas para futuras versiones

- Nuevas secciones de opiniones: películas, series, viajes, regalos.
- Línea de tiempo con nuestros momentos importantes.
- Cartas o mensajes secretos que se desbloquean en fechas especiales (aniversarios, cumpleaños).
- Contador de días juntos en el Inicio.
- Mapa con los lugares visitados.
- Playlist o canción nuestra.
- Modo oscuro en lila profundo.

---

## 9. Decisiones tomadas y pendientes

- **Personas:** Nerea (apodo "Porfiada", color lila) y Lucas (color negro).
- **Ranas:** 30 en total; el premio final es un cupón a elección de Lucas.
- **Fotos:** 5 fotos, en lugares poco molestos pero que se vean muy bien.
- **Mensaje final:** "TE AMO MAS HERMOSA LINDA DE MI CORAZON TE AMO CON TODO MI SERR!!"
- **Reseñas:** además de lo básico, incluyen qué pedimos, precio aproximado y si volveríamos.
