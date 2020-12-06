from flask import Flask, render_template, request
from json_parser import WeatherRetriever as wr, available_cities
import json

app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return render_template('main_page.html')


@app.route('/get_weather')
def get_city_weather():
    wr_obj = wr()
    requested_city = request.cookies.get("currentCity", "")
    if requested_city:
        result = wr_obj.get_weather(requested_city)
    else:
        result = {
            "error": "Incorrect city"
        }
    return json.dumps(result)


@app.route('/search_city')
def search_city():
    results = []
    for city in available_cities.keys():
        if request.args.get('query').lower() in city.lower():
            results.append(city)
            if len(results) == 5:
                break
    result = {
        "result": results
    }
    return json.dumps(result)

