var fs = require('fs');
var process = require("child_process");
var execFile = process.execFile;
var casper = require('casper').create({
  logLevel: "debug"
});

var inputPath = casper.cli.args[0] || 'keywords.json';

casper.echo('inputPath: ' + inputPath);

var keywords = fs.read(inputPath);
keywords = JSON.parse(keywords);

function runNotificationScript(message) {
  this.echo('in runNotificationScript:\n\n' + JSON.stringify(message));

  execFile("./sendNotification.sh", [message], null, function (err, stdout, stderr) {
    console.log("execFileSTDOUT:", JSON.stringify(stdout))
    console.log("execFileSTDERR:", JSON.stringify(stderr))
  })
}
runNotificationScript = runNotificationScript.bind(casper);

casper
.start('http://www.izsu.gov.tr/Pages/wiregularoutage.aspx')
.thenEvaluate(function(keywords){

  jQuery(function(){
    var params = keywords.map(function(current){
      return 'tr:contains("' + current + '")';
    });

    params = params.join(',');
    var result = jQuery('#araicerik table.gwiregulerouot').find(params);

    console.log("jQuery('#araicerik table.gwiregulerouot').find('" + params + "')");
    console.log('found results', result.length);

    if(result.length) {
      var resultMsg = result.map(function() {
          var $td =  $('td', this);
              return $td.eq(3).text().trim() + ', ' + $td.eq(4).text().trim() + ' : ' + $td.eq(2).text().trim() + ' | ' + $td.eq(5).text().trim()
      }).get();

      console.log('kodgemisi-notification', JSON.stringify(resultMsg))
    }

  });

}, keywords);

casper.on('remote.message', function(msg) {

    if(msg.indexOf('kodgemisi-notification') > -1) {
      var resultMsg = msg.replace('kodgemisi-notification', '');
      runNotificationScript(resultMsg);
    }

    this.echo('> ' + msg);
});

casper.on("page.error", function(msg, trace) {
    this.echo("Error> " + msg + JSON.stringify(trace), "ERROR");
});

casper.on("error", function(msg, trace) {
    this.echo("[Error]: >" + msg, "ERROR");
});

casper.run();
