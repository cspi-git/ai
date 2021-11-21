//Main
function normalize(json = {}){
    let values = json.match(/\w+:/g)
    
    for( i in values ){
        json = json.replace(values[i], `"${values[i].replace(":", "")}":`)
    }

    json = JSON.parse(json)

    return json
}

//Exporter
module.exports = {
    normalize
}