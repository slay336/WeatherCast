
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
        currentDate: 'no data yet',
        currentTemperature: '',
        currentTime: '',
        realFeel: '',
        humidity: '',
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
                let lastSearchText = this.searchText;
                let promise = new Promise(function(resolve, reject){
                    // ждем полсекунды, потом запрашиваем подходящие города
                    setTimeout(() => resolve('done'), 500);
                });
                promise.then(function(result){
                    // запрашиваем подходящие города только если по истечении секунды текст поискового запроса не
                    // изменился
                    if (lastSearchText === app.searchText) {
                        axios
                            .get('/search_city?query=' + app.searchText)
                            .then(function(response){
                                app.searchResults.results = response.data.result.slice(0, 5);
                                app.searchResults.show = true;

                            });
                    }
                });
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
            this.requestWeather();
        },
        requestWeather: function() {
            axios
                .get('/get_weather')
                .then(function(response) {
                    for (var key in response.data) {
                        app[key] = response.data[key];
                    }
                });
        },
        cityButtonSelect: function(event){
            function getOptionIndex(element) {
                return parseInt(element.id.replace(/option/gi, ''))
            }
            let optionsAmount = document.getElementById('searchOptions').children.length;
            if (optionsAmount > 0) {
                let selectedCities = document.getElementsByClassName('searchOption active');
                for (let element in selectedCities) {
                    element.classList.remove('active');
                }
                let currentlySelectedCity = selectedCities.length > 0 ? selectedCities[0] : 'option0';
                let curre
                let newActiveCityIndex, newActiveCity;
                if (event.key === 'ArrowUp') {
                    newActiveCityIndex = getOptionIndex(currentlySelectedCity);
                    if (newActiveCityIndex >= 1) {
                        newActiveCityIndex--;
                    }
                }
            }
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