var app = new Vue({
  el: "#app",
  data: {
    time: "hola",
    startTime: 0,
    message: "Funciona",
  },

  methods: {
    getTime: function () {
        console.log('dfsd');
        axios
        .get('http://localhost:3000/pdf')
        .then(response => {
            let result = "";
            let pdfName = 'covid_reports'; 
            var doc = new jsPDF();

            doc.text("REPORTES COVID POR CIUDAD", 55, 30);
            
            let row = 45;
            let pageHeight= doc.internal.pageSize.height;
            for(var i=0; i<response.data.length; i++,row+=7){
                doc.text(response.data[i].location +": " +response.data[i].cant, 20, row);
                if(row >= (pageHeight-25)){
                    doc.addPage();
                    row = 25;
                }
            }
            doc.save(pdfName + '.pdf');
        }
        );
    },
    drawStart: function () {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
  
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
            ["Task", "Hours per Day"],
            ["Work", 11],
            ["Eat", 2],
            ["Commute", 2],
            ["Watch TV", 8],
            ["Sleep", 7],
          ]);
  
          var options = {
            title: "My Daily Activities",
          };
  
          var chart = new google.visualization.PieChart(
            document.getElementById("piechart")
          );
  
          chart.draw(data, options);
        }
      },
    },
  });