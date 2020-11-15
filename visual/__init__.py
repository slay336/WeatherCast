from flask import Flask, render_template, request
# from json_parser import WeatherRetriever as wr
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
    # wr_obj = wr()
    # city = list(request.form.keys())[0]
    # city_temp: dict = wr_obj.get_weather(city)
    # city_temp["link"] = f'http://openweathermap.org/img/wn/{city_temp["icon"]}@2x.png'

    result = {
        "currentDate": get_current_date()
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


def get_current_date():
    current_date = datetime.datetime.now()
    result = current_date.strftime('%A, %b %d')
    return result


