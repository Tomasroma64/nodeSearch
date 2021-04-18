const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const port = 5551;


const bodyParser = require('body-parser');
const e = require('express');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.use(express.static(__dirname + '/public'));

app.get('/styles.css', async(req, res) => {
    console.log("Serving styles.css")
    res.sendFile(__dirname + '/public/styles.css')
});
app.get('/scripts.js', async(req, res) => {
    console.log("Serving scripts.js")
    res.sendFile(__dirname + '/public/scripts.js')
});


const subjectsFolder = "subjects";

class Searcher {

    constructor(subjectsToLoad) {
        this.subjectsToLoad = subjectsToLoad;
        this.allTexts = [];
        this.allFiles = [];

        this.subjectsToLoad.forEach(subject => {
            this.allTexts.push(this.loadFiles(subject));
        });
    }

    getSubjectName() {
        return this.subjectsToLoad[0] //TODO: Wont be an array, just variable
    }

    loadFiles(subjectFolderName) {
        if (!fs.existsSync(path.resolve(subjectsFolder, subjectFolderName))) throw 'No path for ' + subjectFolderName;

        console.log(`Loading: ${subjectFolderName}`)

        let extracted = []
        const allFileNames = fs.readdirSync(path.resolve(subjectsFolder, subjectFolderName));


        for (let file of allFileNames) {
            console.log(path.resolve(subjectsFolder, subjectFolderName, file))
            extracted.push({
                fileName: file,
                text: fs.readFileSync((path.resolve(subjectsFolder, subjectFolderName, file)), 'utf8')
            });

        }

        return extracted
    }

    searchFor(searchString) {
        var foundIn = [];
        const searchStringLength = searchString.length;

        this.allTexts.forEach(subject => {
            subject.forEach(file => {

                if (file.text.includes(searchString)) {
                    const indexMatch = file.text.indexOf(searchString)

                    foundIn.push({
                        'fileName': file.fileName,
                        'section': file.text.substring(indexMatch, indexMatch + searchStringLength + 50)
                    })
                }
            });

        });




        return foundIn
    }

    async readFile(path) {

        let dataBuffer = fs.readFileSync(path);
        pdf(dataBuffer).then(function(data) {
                return data
            })
            .catch(function(error) {
                console.log("error")
            })



    }


}



let start = new Date()

let toSearch = ["CHEM", "CS"]

let searchers = [];
toSearch.forEach(subject => {
    searchers.push(new Searcher([subject]))
});

//let googleIt = new searcher()

let end = new Date() - start
console.info(`Loading time: ${end}ms`)


app.get("/qp/:fileName", (req, res) => {
    res.sendFile(__dirname + "\\qp\\" + req.params.fileName)
})
app.get("/ms/:fileName", (req, res) => {
    res.sendFile(__dirname + "\\ms\\" + req.params.fileName)
})



app.post("/:search", (req, res) => {

    let start = new Date()

    let results = []
    searchers.forEach(searcher => {
        results.push({
            subjectName: searcher.getSubjectName(),
            results: searcher.searchFor(req.params.search)
        });
    });

    let end = new Date() - start
    console.info(`${end}ms: "${req.params.search}"`)
    res.send({
        queryTime: end,
        query: req.params.search,
        results: results
    });

});


app.listen(port, () => console.log(process.env.DOMAINNAME || ('http://localhost:' + port)));