var app = new Vue({
    el: '#app',
    data: {
      time: 'hola',
      startTime: 0,
      message: 'Funciona'
    },

    methods: {
        getTime: function () {
            console.log('dfsd');
            axios
            .get('http://localhost:3000/item')
            .then(response => {
                this.message = response.data.age;
            }
            );
        }
    }
});