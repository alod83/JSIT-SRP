import numpy as np
from math import floor
from math import copysign

cx = 0.1
cy = 0.1

def get_position(x,cx,type):
    if cx > 0:
        if type == "lng":
            xg = floor(copysign((abs(x)%180),x)/cx)
            if xg == -0:
                xg = 0 
        else:
            xg = floor(x/cx)
    else:
        xg = -1
    return xg
    
def get_position_in_grid(x, y, cx, cy):
    xg = get_position(x,cx,"lng")
    yg = get_position(y,cy,"lat")
    return np.array([xg, yg])
        
import json
with open('../data/malta.geo.json') as f:
    data = json.load(f)
for feature in data['features']:
	print(len(feature['geometry']['coordinates']))
	for i in range(0,len(feature['geometry']['coordinates'])):
		for lng,lat in feature['geometry']['coordinates'][i][0]:
			col,row = get_position_in_grid(lng,lat, cx,cy)
			row = row - 323
			col = col - 104
			print("[" + str(row) + "," + str(col) + "]")