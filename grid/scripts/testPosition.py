import numpy as np
from math import floor
from math import copysign

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
    
coord = [15.6209,36.1513]
print(get_position(coord[0], 0.1, "lng"))
print(get_position(coord[1], 0.1, "lat"))