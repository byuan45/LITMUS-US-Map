import json

fields = ['date', 'death', 'hospitalizedCumulative', 'positive', 'totalTestResults']

f1 = open('CTPNational.txt', 'r')
lines = json.loads(f1.read())
filtered = [{f: l[f] for f in fields} for l in lines]
#print(filtered)

clean = []
for line in filtered:
	if None not in line.values():
		clean.append(line)

with open('CTPNational.txt', 'w') as f:
  json.dump(clean, f)

#states = set([d['state'] for d in clean])
#print(states)
#print(len(states))
#print([(d['date'], d['positive']) for d in clean])