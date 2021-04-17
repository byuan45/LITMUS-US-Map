import requests
import json

#response = requests.get("https://api.covidtracking.com/v1/states/daily.json")
response = requests.request("GET", "https://api.covidtracking.com/v1/US/daily.json")
 
with open('CTPNational.txt', 'wb') as f:
    f.write(response.content)
"""
data = str(response.content)
data = json.loads(data[data.index("b'")+2:data.index("\\n'")])
if type(data) is dict:
	temp = list()
	temp.append(data)
	data = temp
#print(type(data))
values = ["date", "state", "positive"]
for record in data:
	filtered = {v: record[v] for v in values}
	print(filtered)
"""