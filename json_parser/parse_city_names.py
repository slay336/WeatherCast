import json

city_data = {}
with open('cities_info.json', 'r') as f:
    for city in json.loads(f.read()):
        if city["name"].strip() not in city_data.keys():
            city_data[city["name"]] = {
                "lon": city["coord"]["lon"],
                "lat": city["coord"]["lat"]
            }
with open("city_names.json", "w") as f:
    print(json.dumps(city_data), file=f)

