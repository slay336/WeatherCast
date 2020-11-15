
function getCookie(name) {
  // заимствовано из https://learn.javascript.ru/cookie
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

Vue.component('currentimage', {
    props: ['imagename'],
    template: '<img :src="\'static/img/\' + imagename + \'.png\'">'
});

var app = new Vue({
    el: '#page',
    data: {
        currentDate: '',
        currentTemperature: '27 C / 81F',
        currentTime: '14:35',
        realFeel: 'Real Feel 25 C / 76F',
        humidity: 'Humidity 61%',
        currentImage: '01d',
        forecasts: [
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            }
        ],
        searchResults: {
            results: [],
            show: false
        },
        searchText: ""
    },
    methods: {
        sendSearchRequest: function() {
            if (this.searchText != "") {
                axios
                    .get('/search_city?query=' + this.searchText)
                    .then(function(response){
                        app.searchResults.results = response.data.result.slice(0, 5);
                    });
                this.searchResults.show = true;
            } else {
                this.searchResults = {
                    results: [],
                    show: false
                }
            }
        },
        chooseSearchResult: function(event) {
            this.searchText = event.target.innerHTML.trim();
            this.searchResults.show = false;
            document.cookie = "currentCity=" + this.searchText;
        },
        requestWeather: function() {
            axios
                .get('/get_weather')
                .then(function(response) {
                    app.currentDate = response.data.currentDate;
                })
        }
    }
});

window.onload = function() {
    currentCity = getCookie("currentCity");
    if (currentCity != undefined) {
        app.searchText = currentCity;
        app.requestWeather();
    }
};