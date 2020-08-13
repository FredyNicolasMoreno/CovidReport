var app = new Vue({
  el: "#app",
  data: {
    city: "",
    message: "",
  },

  methods: {
    getPDF: function () {
        console.log('entra para petición');
        console.log(this.city);
        axios
        .get('http://192.168.100.36/pdf', {params: {city:this.city}})
        .then(response => {
            let result = "";
            let pdfName = 'covid_reports'; 
            var doc = new jsPDF();

            doc.text("REPORTE DE PACIENTES COVID", 58, 30);
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text("CIUDAD: " +this.city.toUpperCase(), 20, 45);
            doc.text("PACIENTES: ", 20, 62);
            
            let row = 72;
            let pageHeight= doc.internal.pageSize.height;

            doc.setFont("helvetica");
            doc.setFontType("normal");
            var numCases = 0;
            
            for(var i=0; i<response.data.length; i++,row+=7){
                doc.text("- " +response.data[i].name, 20, row);
                numCases++;
                if(row >= (pageHeight-25)){
                    doc.addPage();
                    row = 25;
                }
            }
            row+=10;
            doc.setFontType("bold");
            doc.text("TOTAL DE CASOS EN " +this.city.toUpperCase() +": " +numCases, 20, row);
            doc.save(pdfName + '.pdf');
            this.message = "Reporte generado con éxito";
        }
        );
    },
    drawStart: function () {
      axios.get('http://192.168.100.36:8081/chart').
      then(response => {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
        console.log(response.data);
        let result = response.data.split(",");
        function drawChart() {

          cases = [];
          cases.push(["Ciudad", "Cantidad"]);
          for (let x = 0; x < result.length; x++){
            let casePerCity = result[x].split("-");
            cases.push([casePerCity[0],parseInt(casePerCity[1],10)]);
          }
          console.log(cases);
          var data = google.visualization.arrayToDataTable(cases);
  
          var options = {
            title: "Casos Covid",
          };
  
          var chart = new google.visualization.PieChart(
            document.getElementById("piechart")
          );
  
          chart.draw(data, options);
        }
      }); 
    },
  },
});
