# RushTime — Backend

API REST desarrollada con Node.js y Express para la plataforma web de seguimiento de películas y series RushTime.

## Tecnologías

- Node.js + Express
- MySQL (XAMPP)
- JWT (jsonwebtoken)
- bcryptjs
- Axios
- dotenv

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   npm install
3. Crea el archivo .env con las siguientes variables:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=rushtime
   DB_PORT=3306
   JWT_SECRET=tu_clave_secreta
   TMDB_API_KEY=tu_clave_de_tmdb
   PORT=3000
4. Crea la base de datos en MySQL con el nombre rushtime
5. Arranca el servidor:
   npm run dev

El servidor estará disponible en http://localhost:3000

## Endpoints principales

- /api/auth — Registro, login y perfil
- /api/tmdb — Catálogo de películas y series
- /api/lists — Gestión de contenido guardado y favoritos
- /api/reviews — Reseñas de usuarios
- /api/custom-lists — Listas personalizadas
- /api/admin — Panel de administración

## Repositorio frontend

https://github.com/Raquel-Camara/RushTime-Front