

const model = require('./model');
const{log, biglog, errorlog, colorize}= require("./out");

/**
*Muestra la ayuda
**/
exports.helpCmd = rl => {
  		log(" add : añadir un quiz al prgrama");
  		log(" credits : devuelve el nombre de los autores de la practica");
  		log(" list : listar todas las preguntas");
  		log(" show <id> : Muestra la pregunta y la respuesta asociada a id");
  		log(" delete <id> : Elimina la pregunta y la respuesta del quiz");
  		log(" edit <id> : Edita la pregunta y/o la respuesta con el id indicado");
  		log(" test <id> : Probar la pregunta con el id indicado");
  		log(" play/p : Inicia el programa");
  		log(" quit/q : Termina la ejecución del programa");
  		log(" help/h : muestra la ayuda del programa");
  		rl.prompt();

};

/**
*Añadir nuevo quiz
**/

exports.addCmd = rl => {
    	
      rl.question(colorize('Introduzca una pregunta: ', 'red'), question =>{

        rl.question(colorize('Introduzca la respuesta: ', 'red'), answer =>{

          model.add(question, answer);
          log(` ${colorize('Se ha añadido ', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
          rl.prompt();
        });
      });
};

/**
*Muestra los creditos y los autores de la practica
**/

exports.creditsCmd = rl => {
    	log('Autores de la practica:');
    	log('José Manuel Rengifo Reynolds');
    	log('Daniel Acosta Salinero');
    	rl.prompt();
};

/**
*Lista las pregunstas existentes 
**/

exports.listCmd = rl => {
    	model.getAll().forEach((quiz,id) => {
        log(`[${ colorize(id,'magenta')}] : ${quiz.question} `);
      });
    	rl.prompt();

};

/**
*Muestra el quiz indicado
**/

exports.showCmd = (rl, id) => {

    if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id`);
    }else{
        try{
            const quiz = model.getByIndex(id);
            log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
        } catch(error){
            errorlog(error.message);
        }
    }


    rl.prompt();
};

/**
*Borra el quiz indicado
**/

exports.deleteCmd = (rl, id) => {
    	
      if(typeof id === "undefined") {
        errorlog(`Falta el parámetro id`);
      } else {
        try {
          model.deleteByIndex(id);
        } catch(error) {
          errorlog(error.message);
        }
      }

      rl.prompt();
};

/**
*Edita el quiz indicado
**/

exports.editCmd = (rl, id) => {
    	if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id`);
        rl.prompt();
      }else{
        try {
            const quiz= model.getByIndex(id);
            
            process.stdout.isTTY && setTimeout(()=>{rl.write(quiz.question)},0);
           rl.question(colorize('Introduzca una pregunta: ', 'red'), question =>{
              process.stdout.isTTY && setTimeout(()=>{rl.write(quiz.answer)},0);
            rl.question(colorize('Introduzca la respuesta: ', 'red'), answer =>{

                model.update(id,question, answer);
                log(` ${colorize('Se ha modificado ', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                rl.prompt();
          });
          });
        } catch(error) {
          errorlog(error.message);
          rl.prompt();


    	}
    }

};

/**
*Testea la pregunta indicada
**/

exports.testCmd = (rl , id) => {
    if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id`);
        rl.prompt();
    }else{
        try{

            const quiz = model.getByIndex(id);

            rl.question(`${colorize(quiz.question, 'red')} `, question => {
                if(question === quiz.answer){
                    log("Su respuesta es correcta");
                    biglog('CORRECTA','green');
                }else{
                    log("Su respuesta es incorrecta");
                    biglog('INCORRECTA', 'red');
                }
                rl.prompt();
            });
        } catch(error){
            errorlog(error.message);
            rl.prompt();
        }
    }
};

/**
*Juega
**/

exports.playCmd = rl => {

    let score = 0;
    let toBeResolved = [];
    let total = model.count();
    biglog(`A jugar`, "green");
    for (var i = 0; i < model.count(); i++) {
        toBeResolved[i]=i;
    };
    const aleatorio = () => {
        id = Math.floor(Math.random()*toBeResolved.length);
    }

    const playOne = () => {

        if (toBeResolved.length === 0){
            log("No hay más preguntas que responder", "red");
            rl.prompt();

        }else{
            aleatorio();
            while(toBeResolved[id]==="a"){
                aleatorio();
            }
            let quiz = model.getByIndex(id);
            toBeResolved.splice(id,1,"a");
            rl.question(`${colorize(quiz.question, 'red')} `, question => {
                if(question.toUpperCase() === quiz.answer.toUpperCase()){
                    score+=1;
                    total-=1;
                    if(total === 0){
                        log(`No hay nada más que preguntar\nFin del juego. Aciertos: ${score}`);
                        biglog(`${score}`, "magenta");
                    }else{
                        log(`CORRECTO - Lleva ${score} aciertos`);
                        playOne();
                    };
                }else{
                    log(`INCORRECTO\nFin del juego. Aciertos: ${score}`);
                    biglog(`${score}`, 'red');
                }
                rl.prompt();
            });
        };

    }
    playOne();

};
exports.quitCmd = rl =>{
  rl.close();
};