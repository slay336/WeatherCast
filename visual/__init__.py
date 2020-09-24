from flask import Flask, render_template
from json_parser import WeatherRetriever
app = Flask(__name__)

@app.route('/')
def hello_world():
    city_list = WeatherRetriever.get_available_cities()
    return render_template('base.html', city_list=city_list)

