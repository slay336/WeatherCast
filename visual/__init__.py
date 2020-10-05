from flask import Flask, render_template, request
from json_parser import WeatherRetriever as wr
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
    city_list = wr.get_available_cities()
    return render_template('main_page.html', city_list=city_list)


@app.route('/get_weather', methods=['POST', ])
def get_city_weather():
    wr_obj = wr()
    city = list(request.form.keys())[0]
    city_temp: str = wr_obj.get_weather(city)
    temp_dict = {city: city_temp}
    return json.dumps(temp_dict)
