import json
import numpy as np
from sklearn import linear_model


f = open('CTPNational.txt', 'r')
lines = json.loads(f.read())
lines.reverse()
dates = np.array([l['date'] for l in lines])
cases = np.array([l['positive'] for l in lines])
tests = np.array([l['totalTestResults'] for l in lines])
hosp = np.array([l['hospitalizedCumulative'] for l in lines])
X = [[tests[i]] for i in range(len(lines))]

regr = linear_model.LinearRegression()
regr.fit(X, cases)
print("Test Coef: ", regr.coef_)

X = [[hosp[i]] for i in range(len(lines))]
regr = linear_model.LinearRegression()
regr.fit(X, cases)
print("Hosp Coef: ", regr.coef_)