
const fs = require("fs");

//fichero en el que guardos los quizzes
const DB_FILENAME = "quizzes.json";

// Modelo de datos

let quizzes = [
	{question: "Capital de Italia",answer: "Roma"},
	{question: "Capital de Francia",answer: "París"},
	{question: "Capital de España",answer: "Madrid"},
	{question: "Capital de Portugal",answer: "Lisboa"}
];

//Cargar cuestiones en el fichero si no existe el fichero json lo crea
const load = () =>{

	 fs.readFile(DB_FILENAME, (err, data) =>{
	 	if(err) {
            //la primera vez no existe el fichero
            if (err.code === "ENOENT") {
                save();
                return;
            }
            throw err;
        }
	 let json = JSON.parse(data);
	 if(json) {
         quizzes = json;
     }
	 });
};
//salvar preguntas 

const  save = () =>{
	fs.writeFile(DB_FILENAME,
		JSON.stringify(quizzes),
		err =>{
			if (err)throw err;
		});
};

//Devuelve numero total de preguntas existentes
exports.count = () => quizzes.length;

//Añadir un quizz
exports.add = (question,answer) => {
	 quizzes.push({
	 	question: (question || "").trim(),
	 	answer: (answer || "").trim()
	 });
	 save();
};

//Actualiza la quizz en la posicion index

exports.update = (id , question, answer) =>{
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error(`El valor del parámetro id no es válido`);
	}
	quizzes.splice(id ,1, {
		question: (question || "").trim(),
	 	answer: (answer || "").trim()
	 });
	save();
};

//Devuelve los quizzes existentes (clonado)
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

//Devuelve un clon de quizz almacenado en la posicion dada
exports.getByIndex = id => {

	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error (`El valor del parámetro id no es válido`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

//Eliminar quizz posicion dada por id
exports.deleteByIndex = id =>{
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error (`El valor del parámetro id no es válido`);
	}
	quizzes.splice(id, 1);
	save();
};

//cargar quizzes;
load();