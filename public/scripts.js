(function() {
    var oldVal;

    $('#fquestion').bind('DOMAttrModified textInput input change keypress paste focus', function() {
        var val = this.value;
        if (val !== oldVal) {
            oldVal = val;

            // Query
            $.post("/" + $("#fquestion").val())

            .done(function(data) {
                $("#results").empty();
                console.log(data)
                $("#query-time").text(data["queryTime"])
                $("#results-total").text(data["results"].length)
                for (let i = 0; i < data["results"].length; i++) {

                    if (i > 10) {
                        let moreResults = data["results"].length - 10
                        $("#results").append(`
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

                    const element = data["results"][i];


                    let qpLink = "qp/" + element.replace(".txt", ".pdf")
                    let msLink = "ms/" + element.replace(".txt", ".pdf").replace("qp", "ms")
                    $("#results").append(`
                        <tr>
                            <th>
                                ${element}
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
        }
    });
}());