import json

city_list = []
with open('cities_info.json', 'r') as f:
    for city in json.loads(f.read()):
        if city["name"].strip() not in city_list:
            city_list.append(city["name"].strip())
with open("city_names.json", "w") as f:
    print(json.dumps(city_list), file=f)

