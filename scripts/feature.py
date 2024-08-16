import sys
import json
from PIL import Image
import os
from feature_extractor import FeatureExtractor

fe = FeatureExtractor()

# Get the image path from command-line arguments
img_path = sys.argv[1]
img_path = img_path.replace('\\', '/')

# # Extract features
feature = fe.extract(img=Image.open(img_path))
feature_list = feature.tolist()

print(json.dumps(feature_list))