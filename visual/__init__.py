from flask import Flask, render_template, request
from json_parser import WeatherRetriever as wr
from db import Session, City
import json

app = Flask(__name__)
wr_obj = wr()

@app.route('/')
@app.route('/index')
def index():
    return render_template('main_page.html')


@app.route('/get_weather')
def get_city_weather():
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
    session = Session()
    for city in session.query(City.name).filter(City.name.ilike(f"%{request.args.get('query')}%")).limit(5):
        results.append(city[0])
    result = {
        "result": results
    }
    return json.dumps(result)

