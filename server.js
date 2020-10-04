const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const port = 3000;


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.use(express.static(__dirname + '/public'));

app.get('/styles.css', async(req, res) => {
    res.sendFile(__dirname + '/public/styles.css')
});
app.get('/scripts.js', async(req, res) => {
    res.sendFile(__dirname + '/public/scripts.js')
});
/*
app.get('/favicon.ico', async(req, res) => {
    res.sendFile(__dirname + '/public/scripts.js')
});
*/



class searcher {

    constructor(subjectName) {
        this.subjectName = subjectName;
        this.allTexts = [];
        this.allFiles = [];

        this.loadFiles();
    }

    loadFiles() {

        this.allFiles = fs.readdirSync(path.resolve(__dirname, 'subjects\\' + this.subjectName));
        for (let file of this.allFiles) {
            //console.log(file)
            this.allTexts.push({
                fileName: file,
                text: fs.readFileSync("subjects\\" + this.subjectName + "\\" + file, 'utf8')
            })
        }

    }

    searchFor(searchString) {
        var foundIn = [];

        for (let file of this.allTexts) {
            //console.log("looking for in " + file.fileName)
            if (file.text.includes(searchString)) {
                foundIn.push(file.fileName)
            }

        }

        return foundIn
    }

    async getFileText(path) {
        // Blocking step
        return fs.readFileSync(path, 'utf8');

    }

    static getSubjects(width, height) {
        return width * height;
    }
}

let start = new Date()

let googleIt = new searcher("BIO")

let end = new Date() - start
console.info('Loading time: %dms', end)


app.get("/qp/:fileName", (req, res) => {
    res.sendFile(__dirname + "\\qp\\" + req.params.fileName)
})
app.get("/ms/:fileName", (req, res) => {
    res.sendFile(__dirname + "\\ms\\" + req.params.fileName)
})



app.post("/:search", (req, res) => {

    let start = new Date()

    let results = googleIt.searchFor(req.params.search);

    let end = new Date() - start
    console.info('Query time: %dms', end)
    res.send({
        queryTime: end,
        query: req.params.search,
        results: results
    });

});





app.listen(port, () => console.log(process.env.DOMAINNAME || ('http://localhost:' + port)));