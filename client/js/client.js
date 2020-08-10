var app = new Vue({
  el: "#app",
  data: {
    time: "hola",
    startTime: 0,
    message: "Funciona",
  },

  methods: {
    getTime: function () {
      console.log("dfsd");
      axios.get("http://localhost:3000/item").then((response) => {
        this.message = response.data.age;
      });
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
