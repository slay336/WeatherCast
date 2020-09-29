from flask import Flask, render_template, request
from json_parser import WeatherRetriever as wr
app = Flask(__name__)

@app.route('/')
def hello_world():
    city_list = wr.get_available_cities()
    return render_template('main_page.html', city_list=city_list)


@app.route('/get_weather',methods=['POST',])
def get_city_weather():
    wr_obj = wr()
    city = request.args.get('city')
    city_temp: str = wr_obj.get_weather(city)
    return render_template('city_weather.html', city_temp=city_temp, city=city)
