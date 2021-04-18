(function() {
    var oldVal;

    $('#fquestion').bind('DOMAttrModified textInput input change keypress paste focus', function() {
        var val = this.value;
        if (val !== oldVal) {
            oldVal = val;

            $.post("/" + $("#fquestion").val())

            .done(function(data) {
                $("#results-table-holder").empty();
                console.log(data)
                $("#query-time").text(data["queryTime"])

                let totalNumPapers = 0
                data["results"].forEach(subject => {

                    let subjectName = subject["subjectName"];
                    let subjectResults = subject["results"];
                    let resultsLength = subjectResults.length;

                    totalNumPapers += resultsLength;

                    $("#results-table-holder").append(`
                        <h3>${subjectName} <span class="section">(${resultsLength})</span></h3>
                        <table id="${subjectName}-restults-table"></table>
                    `)

                    for (let i = 0; i < subjectResults.length; i++) {

                        let tableSelector = `#${subjectName}-restults-table`;

                        if (i > 10) {
                            let moreResults = subjectResults.length - 10
                            $(tableSelector).append(`
                            <tr>
                                <th>
                                <br>
                                    ${moreResults} more elements
                                </th>
                                <th> 
                                    
                                </th>
                                <th>
                                    
                                </th>
                            </tr>
                            `);
                            break
                        }

                        const fileName = subjectResults[i]["fileName"];
                        const section = subjectResults[i]["section"];

                        let qpLink = "qp/" + fileName.replace(".txt", ".pdf")
                        let msLink = "ms/" + fileName.replace(".txt", ".pdf").replace("qp", "ms")

                        $(tableSelector).append(`
                            <tr>
                                <th>
                                    ${fileName}   <span class="section">  ...${section}...</span>
                                </th>
                                <th> 
                                    <a href=\" ${qpLink} "\" + target=\"_blank\"> qp </a>
                                </th>
                                <th>
                                    <a href=\" ${msLink} "\" + target=\"_blank\"> ms </a>
                                </th>
                            </tr>
                            `);

                    }
                });

                $("#results-total").text(totalNumPapers)

            });
        }
    });
}());

$("#change-theme").click(() => {
    $("body").toggleClass("dark")
})