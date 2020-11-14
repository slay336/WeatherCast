from flask import Flask, render_template, request
from json_parser import WeatherRetriever as wr
import json

app = Flask(__name__)

with open("city_names.json", "r") as f:
    available_cities = json.loads(f.read())


@app.route('/')
def hello_world():
    city_list = ['hi', 'hello']
    return render_template('main_page.html', city_list=city_list)


@app.route('/get_weather', methods=['POST', ])
def get_city_weather():
    wr_obj = wr()
    city = list(request.form.keys())[0]
    city_temp: dict = wr_obj.get_weather(city)
    city_temp["link"] = f'http://openweathermap.org/img/wn/{city_temp["icon"]}@2x.png'
    return json.dumps(city_temp)


@app.route('/search_city')
def search_city():
    results = []
    for city in available_cities:
        if request.args.get('query').lower() in city.lower():
            results.append(city)
            if len(results) == 5:
                break
    result = {
        "result": results
    }
    return json.dumps(result)



