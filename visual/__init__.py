from flask import Flask, render_template, request
from json_parser import WeatherRetriever as wr, Metrics
import json
import datetime

app = Flask(__name__)

with open("city_names.json", "r") as f:
    available_cities = json.loads(f.read())


@app.route('/')
@app.route('/index')
def index():
    return render_template('main_page.html')


@app.route('/get_weather')
def get_city_weather():
    wr_obj = wr()
    requested_city = request.cookies.get("currentCity", "")
    if requested_city:
        result = wr_obj.get_weather(requested_city, Metrics.METRIC)
    else:
        result = {
            "error": "Incorrect city"
        }
    return json.dumps(result)


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


