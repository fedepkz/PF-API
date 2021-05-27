db = db.getSiblingDB('CovidAlert');
db.Usuarios.drop();
db.Usuarios.insertMany([
    { _id: 1, first: 'Albert', last: 'Einstein', estado: 1},
    { _id: 2, first: 'Isaac', last: 'Newton', estado: 2 },
    { _id: 3, first: 'Galileo', last: 'Galilei', estado: 3 },
    { _id: 4, first: 'Marie', last: 'Curie', estado: 2 },
    { _id: 5, first: 'Johannes', last: 'Kepler', estado: 4 },
    { _id: 6, first: 'Nicolaus', last: 'Copernicus', estado: 1 },
    { _id: 7, first: 'Max', last: 'Planck', estado: 1 }
]);