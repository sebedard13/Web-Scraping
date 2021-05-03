const requestPromise = require('request-promise');
const url = new URL('https://www.advfn.com/nyse/newyorkstockexchange.asp');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const fs = require('fs');


fs.writeFile('output.csv', "Equity,Symbole,Link\n", function (err) {
    if (err) throw err;
    console.log('File init');
});

//Start
requestPromise(url.href)
    .then(function (html) {
        const dom = new JSDOM(html);
        let listAPages = dom.window.document.querySelectorAll("#az a");
        console.log(listAPages);
        if (listAPages) {
            listAPages.forEach(pageAZ);

        } else {
            console.error("No query #ax a");
        }
        //****Reddit Post grab****//
        // let title = dom.window.document.querySelector(".Post div:nth-child(3) div h1");
        // let content = dom.window.document.querySelector(".Post div:nth-child(4) div");
        // tempObj = {title: title.textContent, content: content.textContent}
        // obj = {...obj, ...tempObj};
        //
        // let postKarma = dom.window.document.querySelector(".Post div:nth-child(1) div").textContent;
        // let postKarmaString;
        // if(parseFloat(postKarma) == NaN){
        //     postKarmaString = "N/A"
        // }
        // else if (postKarma.includes("k")) {
        //     postKarmaString = "min "+ parseFloat(postKarma)*1000
        // }
        // tempObj = {postKarma: postKarmaString};
        // obj = {...obj, ...tempObj};

    })
    .catch(function (err) {
        //handle error
    });

let promiseReturn = 0;
function pageAZ(item, index) {

    requestPromise(url.origin + item.href)
        .then(function (html) {
            const dom = new JSDOM(html);
            let ligneTableau = dom.window.document.querySelectorAll(".tab1 .ts0, .tab1 .ts1");
            let output = []
            if(ligneTableau){
                for (let i = 0; i < ligneTableau.length; i++) {
                    let equity = ligneTableau[i].querySelector("td:nth-child(1)");
                    let symbole = ligneTableau[i].querySelector("td:nth-child(2)");
                    let chartLink = ligneTableau[i].querySelector("td:nth-child(3) a:first-child");
                    let stock = { equity: equity.textContent, symbole: symbole.textContent, link: chartLink.href };
                    output.push(stock);
                }
                let string= "";
                for (let i = 0; i < output.length; i++) {
                    string+= "\""+output[i].equity+"\",\""+output[i].symbole+"\",\""+output[i].link+"\"\n"
                }

                promiseReturn++;
                fs.appendFile('output.csv', string, function (err) {
                    if (err) throw err;
                    console.log('Link ' + promiseReturn+"/28 done");
                });
            }
        })
        .catch(function (err) {
            console.log("nop[e");
        });

}