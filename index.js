//Dependencies
const { SocksProxyAgent } = require("socks-proxy-agent")
const Log_Interceptor = require("log-interceptor")
const { PythonShell } = require("python-shell")
const { ArgumentParser } = require("argparse")
const Logger = require("./utils/logging.js")
const Public_IP = require("public-ip")
const SJN = require("./utils/sjn")
const Chalk = require("chalk")
const Delay = require("delay")
const Axios = require("axios")
const Path = require("path")
const Yaml = require("yaml")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)
const Parser = new ArgumentParser({
    usage: 'ai [flags] | To use spaces without interrupting the arguments use ""'
})

var Self = {}
Self.templates_for_scan = []
Self.vulnerabilities = {
    total: 0,
    info: 0,
    low: 0,
    medium: 0,
    high: 0,
}

//Functions
function directory_files(dir, done) {
    var results = []

    Fs.readdir(dir, function (err, list) {
        if (err) return done(err)

        var list_length = list.length

        if (!list_length) return done(null, results)

        list.forEach(function (file) {
            file = Path.resolve(dir, file)

            Fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    directory_files(file, function (err, res) {
                        results = results.concat(res)

                        if (!--list_length) done(null, results)
                    })
                } else {
                    if(file.indexOf(".yaml") != -1 || file.indexOf(".yml") != -1){
                        results.push(file)
                    }
                    
                    if (!--list_length) done(null, results)
                }
            })
        })
    })
}

function scan(template, url, Parser_Args){
    return new Promise(async(res)=>{
        template.code = template.code.replace(/{{url}}/g, url)
        template.code = template.code.replace(/{{self_info}}/g, `"${template.information.name}", "${template.information.id}", "${template.information.risk}"`)

        Log_Interceptor({ passDown: true, splitOnLinebreak: true })

        await eval(`let tor;

if(Parser_Args.tor){
    tor = new SocksProxyAgent("socks5h://" + Parser_Args.tor)
}

async function _MakeQuest_(link, options = { method: "GET", timeout: 2000 }){

    if(Parser_Args.headers){
        options = Object.assign(options, Parser_Args.headers)
    }

    return Axios({
        url: link,
        options,
        httpsAgent: tor
    })
}

async function run(){
    return new Promise(async(resolve)=>{
        try{
            ${template.code}
        }catch{
            resolve()
        }
    })
}

module.exports = {
    run
}`).run()
        await Delay(2000)

        let logs = Log_Interceptor.end()
        
        for( i in logs ){
            if(logs[i].indexOf("\x1B[94minfo\x1B[39m") != -1 || logs[i].indexOf("low") != -1 || logs[i].indexOf("medium") != -1 || logs[i].indexOf("high") != -1){
                Self.vulnerabilities.total++
            }

            if(logs[i].indexOf("\x1B[94minfo\x1B[39m") != -1){
                Self.vulnerabilities.info++
            }

            if(logs[i].indexOf("low") != -1){
                Self.vulnerabilities.low++
            }

            if(logs[i].indexOf("medium") != -1){
                Self.vulnerabilities.medium++
            }

            if(logs[i].indexOf("high") != -1){
                Self.vulnerabilities.medium++
            }
        }

        await Delay(1000)
        res()
    })
}

function print_results(){
    if(Self.vulnerabilities.total){
        Logger.normal_log("info", `Vulnerabilities found: total ${Self.vulnerabilities.total} | info ${Chalk.blueBright(Self.vulnerabilities.info)} | low ${Chalk.blue(Self.vulnerabilities.low)} | medium ${Chalk.yellow(Self.vulnerabilities.medium)} | high ${Chalk.red(Self.vulnerabilities.high)}`)
    }else{
        Logger.normal_log("info", "No vulnerabilities found.")
    }

    return
}

//Main
Logger.banner_and_information()

if(!Self_Args.length){
    Logger.normal_log("youmean", "ai -h")
    process.exit()
}

const Target = Parser.add_argument_group("Target")
Target.add_argument("-u", "--url", { help: "Target URL to scan." })
Target.add_argument("-us", "--urls", { help: "Path of the file with a list of URL's to scan." })

const Templates = Parser.add_argument_group("Templates")
Templates.add_argument("-t", "--template", { help: "Path of the template to use for scanning." })
Templates.add_argument("-ts", "--tags", { help: "Scan the current directory for templates that contains the tags you specified." })
Templates.add_argument("-au", "--authors", { help: "Scan the current directory for templates that contains the authors you specified." })
Templates.add_argument("-rs", "--risks", { help: "Scan the current directory for templates that contains the risks you specified(info, low, medium, high)." })
Templates.add_argument("-ds", "--descriptions", { help: "Scan the current directory for templates that contains the description(any word) you specified." })

const Connection = Parser.add_argument_group("Connection & Request management")
Connection.add_argument("-hd", "--headers", { help: 'Headers to merge/add in each templates are used.(Example: -hd "{ timeout: 1000 })"' })
Connection.add_argument("-tr", "--tor", { help: "Use Tor as a gateway in any request that Ai makes to hide your real IP/identity.(Warning: Might slowdown the scan)(Example: -tr 127.0.0.1:9050)" })

var Parser_Args = Parser.parse_args()

if(!Parser_Args.url && !Parser_Args.urls){
    Logger.normal_log("critic", "You must use at least 1 flag in Target.")
    process.exit()
}

if(Parser_Args.url && Parser_Args.urls){
    Logger.normal_log("critic", "You can only use 1 flag in Target.")
    process.exit()
}

if(!Parser_Args.template && !Parser_Args.tags && !Parser_Args.authors && !Parser_Args.risks && !Parser_Args.descriptions ){
    Logger.normal_log("critic", "You must use at least 1 flag in Templates.")
    process.exit()
}

if(Parser_Args.template && Parser_Args.tags){
    Logger.normal_log("critic", "You can only use 1 flag in Templates.")
    process.exit()
}

try{
    Parser_Args.headers ? Parser_Args.headers = SJN.normalize(Parser_Args.headers) : null
}catch{
    Logger.normal_log("critic", "Headers flag is invalid.")
    process.exit()
}

Logger.normal_log("info", "Scanning current directory for templates.")
directory_files("./", async function(err, files){
    Logger.normal_log("info", `${files.length} templates found in the current directory.`)

    let IP = await Public_IP.v4()

    if(Parser_Args.tor){
        Logger.normal_log("info", "Connecting to Tor.")
        await Axios.get("https://api.ipify.org", { httpsAgent: new SocksProxyAgent(`socks5h://${Parser_Args.tor}`) || null }).catch(()=>{
            Logger.normal_log("critic", "Unable to connect to Tor, please make sure the IP & port is valid.")
            process.exit()
        }).then((res)=>{
            Logger.normal_log("info", "Successfully connected to Tor.")

            Logger.normal_log("info", "Checking If real IP can be leaked.")
            if(IP == res.data){
                Logger.normal_log("critic", "Error detected, even though connected to Tor the IP isn't changed.")
                process.exit()
            }
            Logger.normal_log("info", "Real IP cant be leaked.")
        })
    }

    if(Parser_Args.urls){
        let urls = Fs.readFileSync(Parser_Args.urls, "utf8").replace(/\r/g, "").split("\n").length

        if(!urls){
            Logger.normal_log("critic", "No urls found.")
            process.exit()
        }

        Logger.normal_log("info", `${urls} urls loaded.`)
    }

    var url_index = 0
    var template_index = 0

    if(!Parser_Args.template){
        if(Parser_Args.tags){
            Parser_Args.tags = Parser_Args.tags.split(",")
        }

        if(Parser_Args.authors){
            Parser_Args.authors = Parser_Args.authors.split(",")
        }

        if(Parser_Args.risks){
            Parser_Args.risks = Parser_Args.risks.split(",")
        }

        if(Parser_Args.descriptions){
            Parser_Args.descriptions = Parser_Args.descriptions.split(",")
        }

        for( i in files ){
            try{
                let template = Yaml.parse(Fs.readFileSync(files[i], "utf8"))
                template.information.tags = template.information.tags.split(",")
                template.information.risk = template.information.risk.split(",")
                template.information.authors = template.information.authors.split(",")
        
                if(Parser_Args.tags){
                    for( i2 in Parser_Args.tags ){
                        for( i3 in template.information.tags ){
                            template.information.tags[i3] = template.information.tags[i3].replace(/\s/g, "")
            
                            if(Parser_Args.tags[i2] == template.information.tags[i3]){
                                if(Self.templates_for_scan.indexOf(files[i]) === -1){
                                    Self.templates_for_scan.push(files[i])
                                }
                            }
                        }
                    }
                }

                if(Parser_Args.authors){
                    for( i2 in Parser_Args.authors ){
                        for( i3 in template.information.authors ){
                            template.information.authors[i3] = template.information.authors[i3].replace(/\s/g, "")
            
                            if(Parser_Args.authors[i2] == template.information.authors[i3]){
                                if(Self.templates_for_scan.indexOf(files[i]) === -1){
                                    Self.templates_for_scan.push(files[i])
                                }
                            }
                        }
                    }
                }

                if(Parser_Args.risks){
                    for( i2 in Parser_Args.risks ){
                        if(Parser_Args.risks[i2] == template.information.risk){
                            if(Self.templates_for_scan.indexOf(files[i]) === -1){
                                Self.templates_for_scan.push(files[i])
                            }
                        }
                    }
                }

                if(Parser_Args.descriptions){
                    for( i2 in Parser_Args.descriptions ){
                        try{
                            if(template.information.description.indexOf(Parser_Args.descriptions[i2]) != -1){
                                if(Self.templates_for_scan.indexOf(files[i]) === -1){
                                    Self.templates_for_scan.push(files[i])
                                }
                            }
                        }catch{}
                    }
                }
            }catch{}
        }
    }

    if(!Parser_Args.template){
        if(!Self.templates_for_scan.length){
            Logger.normal_log("critic", "No templates found.")
            process.exit()
        }
    }else{
        if(!Fs.existsSync(Parser_Args.template)){
            Logger.normal_log("critic", "No template found.")
            process.exit()
        }
    }

    if(Self.templates_for_scan.length){
        Logger.normal_log("info", `${Self.templates_for_scan.length} templates loaded.`)
    }else{
        Logger.normal_log("info", "1 templates loaded.")
    }

    Logger.normal_log("info", "Ai has started scanning.")
    if(Parser_Args.url){
        if(Self.templates_for_scan.length){
            Start()
            async function Start(){
                if(template_index === Self.templates_for_scan.length){
                    print_results()

                    process.exit()
                }

                await scan(Yaml.parse(Fs.readFileSync(Self.templates_for_scan[template_index], "utf8")), Parser_Args.url, Parser_Args)
                template_index++
                Start()
            }

            return
        }

        await scan(Yaml.parse(Fs.readFileSync(Parser_Args.template, "utf8")), Parser_Args.url, Parser_Args)
        print_results()

        process.exit()
    }else if(Parser_Args.urls){
        if(!Fs.existsSync(Parser_Args.urls)){
            Logger.normal_log("critic", "Unable to find the file that contains a list of urls you specified.")
            process.exit()
        }
        
        Parser_Args.urls = Fs.readFileSync(Parser_Args.urls, "utf8").replace(/\r/g, "").split("\n")

        Init()
        async function Init(){
            let url = Parser_Args.urls[url_index]

            if(url_index == Parser_Args.urls.length){
                print_results()
                process.exit()
            }

            if(Self.templates_for_scan.length){
                Start()
                async function Start(){
                    if(template_index === Self.templates_for_scan.length){
                        url_index++
                        template_index = 0
                        Init()
                        return
                    }

                    let template = Yaml.parse(Fs.readFileSync(Self.templates_for_scan[template_index], "utf8"))

                    await scan(template, url, Parser_Args)
                    template_index++
                    Start()
                }

                return
            }
            
            await scan(Yaml.parse(Fs.readFileSync(Parser_Args.template, "utf8")), url, Parser_Args)
            url_index++
            Init()
        }
    }
})