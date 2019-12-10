import pandas as pd
import numpy as np
from math import floor
from math import copysign
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score

data = pd.read_csv("data/data.csv")

nsamples = len(data)

# Split Dataset in Training and Test
n_training = nsamples/100*80
n_test = nsamples - n_training

#X = np.empty(nsamples)
#Y = np.empty(nsamples)
X = []
Y = []
next_rows = []
next_cols = []
for i in range(0,nsamples):
	X.append([data.lat[i] ,data.lng[i]])
	Y.append(data.next[i])
	next_rows.append(data.next_row[i])
	next_cols.append(data.next_col[i])

min_next_row = min(next_rows)
min_next_col = min(next_cols)
n_next_rows = max(next_rows) - min_next_row + 1
n_next_cols = max(next_cols) - min_next_col + 1

X_train = X[:n_training-1]
Y_train = Y[:n_training-1]

X_test = X[n_training:]
Y_test = Y[n_training:]

# Run training
classifier = KNeighborsClassifier(weights='distance',n_neighbors=5)
classifier.fit(X_train, Y_train)

Y_pred = classifier.predict(X_test)

# stampo una matrice, in cui nella x metto Y_test e nella y Y_pred
# coloro la casellina se valore corretto
output_matrix = np.zeros(shape=(n_next_rows,n_next_cols))
for i in range(0,len(Y_pred)):
	row, col = Y_pred[i].split("_")
	row = int(row) - min_next_row
	col = int(col) - min_next_col
	if Y_pred[i] == Y_test[i]:
		# verde chiaro
		output_matrix[row][col] = 255
	else:
		output_matrix[row][col] = 100
	
#plt.imshow(output_matrix, cmap='YlGn', interpolation='nearest')
#plt.show()
plt.imsave('data/matrix.png', output_matrix, cmap='YlGn')


#accuracy = classifier.score(Y_test, Y_pred)
out_file = open("data/metrics.txt","w")
        
out_file.write("Precision macro: %1.3f" % precision_score(Y_test, Y_pred,average='macro') + "\n")
out_file.write("Precision micro: %1.3f" % precision_score(Y_test, Y_pred,average='micro') + "\n")
out_file.write("Precision weighted: %1.3f" % precision_score(Y_test, Y_pred,average='weighted') + "\n")
         
out_file.write("Recall macro: %1.3f" % recall_score(Y_test, Y_pred, average='macro') + "\n")
out_file.write("Recall micro: %1.3f" % recall_score(Y_test, Y_pred, average='micro') + "\n")
out_file.write("Recall weighted: %1.3f" % recall_score(Y_test, Y_pred, average='weighted') + "\n")
        
#out_file.write("Accuracy:   %.3f" % accuracy  + "\n")
out_file.close()
        

