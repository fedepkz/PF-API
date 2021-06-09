# CovidAlert

Este repositorio esta dedicado al desarrollo de la api CovidAlert

## Descripcion

Este proyecto intenta resolver unas de las cuestiones de la crisis sanitaria actual,
perisiguiendo un unico objetivo: mantener un control y seguimiento 
de los usuarios de la aplicacion, a traves de un boton de panico que alerta sobre
cambios en el estado de salud y permite accionar a tiempo con los recuados necesarios.

## Funcionalidades / Casos de uso

- Registrar usuario
- Loguear usuario
- ABM usuarios
- ABM reuniones
- Notificacion por contagio
- Cambios de estado en la salud
- Listado de contactos visitados

## Entidades principales

- Users
- Meetings
- States

## Instrucciones tecnicas

Instalar el Node Package Manager

```bash
npm install
```
El proyecto utiliza [mongodb](https://www.mongodb.com) por lo tanto, si de desea utilizar este mismo esquema
se debe generar un archivo ".env" para declarar las variables globales de mongo como se muestra en el siguiente ejemplo:

```bash
MONGO_URI= mongodb+srv://usuario:contraseña@cluster054.dms7r3.mongodb.net/dbname?retryWrites=true&w=majority
SECRET=miPalabraSecreta
```

Y luego en nuestro archivo connection.js

```bash
const uri = process.env.MONGO_URI
```

Por ultimo, para trabajar con los tokens dentro de nuestros esquemas:

```bash
const tokenPass = process.env.SECRET;
```

## Listado Endpoints

URL: https://salty-bayou-33689.herokuapp.com/api/docs/v1/

## Contribuyendo
Las pull requests son bienvenidas. Para cambios importantes, primero abra un problema para discutir lo que le gustaría cambiar..
Por ultimo, si le interesa ser parte del proyecto, no dude en solicitar las credenciales para su archivo .env

## License
[MIT](https://choosealicense.com/licenses/mit/)
