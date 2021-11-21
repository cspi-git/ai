//Dependencies
const Chalk = require("chalk")

//Main
function normal_log(type, message){
    if(type == "info"){
        console.log(`${Chalk.gray("[") + Chalk.blueBright("INFORMATION") + Chalk.gray("]")} ${message}`)
    }else if(type == "warn"){
        console.log(`${Chalk.gray("[") + Chalk.yellowBright("WARNING") + Chalk.gray("]")} ${message}`)
    }else if(type == "error"){
        console.log(`${Chalk.gray("[") + Chalk.redBright("ERROR") + Chalk.gray("]")} ${message}`)
    }else if(type == "critic"){
        console.log(`${Chalk.gray("[") + Chalk.redBright("CRITICAL") + Chalk.gray("]")} ${message}`)
    }else if(type == "youmean"){
        console.log(`${Chalk.gray("[") + Chalk.blueBright("INFORMATION") + Chalk.gray("]")} You mean? ${message}`)
    }
}

function attack_log(name, id, risk, url){
    if(risk == "info"){
        console.log(`${Chalk.gray("[") + Chalk.blueBright("INFORMATION") + Chalk.gray("]")}[${Chalk.cyanBright(name)}][${Chalk.magentaBright(id)}][${Chalk.blueBright(risk)}] ${url}`)
    }else if(risk == "low"){
        console.log(`${Chalk.gray("[") + Chalk.blueBright("INFORMATION") + Chalk.gray("]")}[${Chalk.cyanBright(name)}][${Chalk.magentaBright(id)}][${Chalk.blue(risk)}] ${url}`)
    }else if(risk == "medium"){
        console.log(`${Chalk.gray("[") + Chalk.blueBright("INFORMATION") + Chalk.gray("]")}[${Chalk.cyanBright(name)}][${Chalk.magentaBright(id)}][${Chalk.yellow(risk)}] ${url}`)
    }else if(risk == "high"){
        console.log(`${Chalk.gray("[") + Chalk.blueBright("INFORMATION") + Chalk.gray("]")}[${Chalk.cyanBright(name)}][${Chalk.magentaBright(id)}][${Chalk.red(risk)}] ${url}`)
    }
}

function banner_and_information(){
    let random_banner_pick = Math.floor(Math.random() * 2) //If 2 means pick random number between 1 and 0, if 3 then pick random number between 2, 1 or 0

    switch(random_banner_pick){
        case 0:
            console.log(Chalk.redBright(`    __¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶___¶¶¶___§§§§§______§§§§§___¶¶¶__
    __¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶___¶¶¶¶¶§§§§§§§§__§§§§§§§§¶¶¶¶¶__
    ________¶¶¶___________¶¶¶¶¶¶§§§§§§§§§§§§¶¶¶¶¶¶____
    ________¶¶¶___________§§§§¶¶¶¶¶¶§§§§§¶¶¶¶¶¶§§§____
    ________¶¶¶___________§§§§§§¶¶¶¶¶¶¶¶¶¶¶¶¶§§§§§____
    ________¶¶¶___________§§§§§§§§¶¶¶¶¶¶¶¶§§§§§§§§____
    ________¶¶¶____________§§§§§§¶¶¶¶¶¶¶¶¶¶§§§§§§_____
    ________¶¶¶_____________§§§§¶¶¶¶¶§§§¶¶¶¶¶§§§______
    ________¶¶¶______________§¶¶¶¶¶§§§§§§¶¶¶¶¶§_______
    ________¶¶¶_____________¶¶¶¶¶¶§§§§§§§§§¶¶¶¶¶¶_____
    ________¶¶¶___________¶¶¶¶¶__§§§§§§§§§§___¶¶¶¶¶___
    __¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶___¶¶¶¶¶______§§§§§§_______¶¶¶¶__
    __¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶___¶¶___________§§___________¶¶__
    __________________________________________________
    __¶¶¶¶¶¶__¶¶¶¶¶¶¶¶___¶¶¶¶¶¶¶¶¶__¶¶¶¶¶¶¶¶_¶¶¶¶¶¶¶¶_
    ___¶¶¶¶¶___¶¶¶¶¶¶__¶¶¶¶¶¶_¶¶¶¶¶__¶¶¶¶¶¶¶__¶¶¶¶¶¶¶_
    _____¶¶¶____¶¶¶___¶¶¶¶_______¶¶¶__¶¶¶_______¶¶¶___
    ______¶¶¶__¶¶¶____¶¶¶_________¶¶¶_¶¶¶_______¶¶¶___
    _______¶¶¶¶¶¶____¶¶¶__________¶¶¶_¶¶¶_______¶¶¶___
    ________¶¶¶¶_____¶¶¶__________¶¶¶_¶¶¶_______¶¶¶___
    ________¶¶¶______¶¶¶¶_________¶¶¶_¶¶¶_______¶¶¶___
    ________¶¶¶_______¶¶¶________¶¶¶¶_¶¶¶_______¶¶¶___
    ________¶¶¶________¶¶¶¶____¶¶¶¶¶___¶¶¶_____¶¶¶____
    ____¶¶¶¶¶¶¶¶¶¶¶_____¶¶¶¶¶¶¶¶¶¶______¶¶¶¶¶¶¶¶¶_____
    _____¶¶¶¶¶¶¶¶¶________¶¶¶¶¶¶__________¶¶¶¶¶_______
    
              ⇢⇢⇢⇢⇢⇢⇢⇢⇢ Psych0 ⇠⇠⇠⇠⇠⇠⇠⇠⇠
             ⇢⇢⇢⇢⇢⇢⇢⇢⇢ Name: Ai ⇠⇠⇠⇠⇠⇠⇠⇠⇠     
          ⇢⇢⇢⇢⇢⇢⇢⇢⇢ Version: 1.0.0 ⇠⇠⇠⇠⇠⇠⇠⇠⇠`))
          break
        case 1:
            console.log(Chalk.blueBright(`
            |\\
            | \\
  ()########|  ==========================================================*
            | /
            |/
            
            ⇢⇢⇢⇢⇢⇢⇢⇢⇢ Psych0 ⇠⇠⇠⇠⇠⇠⇠⇠⇠
           ⇢⇢⇢⇢⇢⇢⇢⇢⇢ Name: Ai ⇠⇠⇠⇠⇠⇠⇠⇠⇠     
         ⇢⇢⇢⇢⇢⇢⇢⇢⇢ Version: 1.0.0 ⇠⇠⇠⇠⇠⇠⇠⇠⇠`))
            break
    }

    console.log()
}

//Exporter
module.exports = {
    normal_log,
    attack_log,
    banner_and_information
}