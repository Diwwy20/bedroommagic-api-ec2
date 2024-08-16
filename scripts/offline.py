# from PIL import Image
# from pathlib import Path
# import numpy as np
# from feature_extractor import FeatureExtractor
# from pymongo import MongoClient

# # Set up MongoDB connection
# client = MongoClient("mongodb+srv://ipureba2:test12@mernapp.syobqzx.mongodb.net/mern-stack")
# db = client.get_database()
# features_collection = db.features

# fe = FeatureExtractor()

# image_root = Path("../static/img")
# for category_folder in image_root.iterdir():
#     if category_folder.is_dir():
#         for img_path in sorted(category_folder.glob("*.jpg")):
#             # Extract a deep feature here
#             feature = fe.extract(img=Image.open(img_path))
#             feature_list = feature.tolist()  # Convert ndarray to list for MongoDB

#             feature_data = {
#                 'fileName': img_path.name,
#                 'category': category_folder.name,
#                 'feature': feature_list
#             }

#             # Save the feature to MongoDB
#             features_collection.insert_one(feature_data)


from PIL import Image
from pathlib import Path
import numpy as np
from feature_extractor import FeatureExtractor
from pymongo import MongoClient

# Set up MongoDB connection
client = MongoClient("mongodb+srv://ipureba2:test12@mernapp.syobqzx.mongodb.net/mern-stack")
db = client.get_database()
features_collection = db.features

fe = FeatureExtractor()

# Define the specific folder to process
image_folder = Path("../static/img/minimal")

# Process only the specified folder
for img_path in sorted(image_folder.glob("*.jpg")):
    # Extract a deep feature here
    feature = fe.extract(img=Image.open(img_path))
    feature_list = feature.tolist()  # Convert ndarray to list for MongoDB

    feature_data = {
        'fileName': img_path.name,
        'category': image_folder.name,
        'feature': feature_list
    }

    # Save the feature to MongoDB
    features_collection.insert_one(feature_data)

print('Success')














# from pymongo import MongoClient

# # Set up MongoDB connection
# client = MongoClient("mongodb+srv://ipureba2:test12@mernapp.syobqzx.mongodb.net/mern-stack")
# db = client.get_database()
# features_collection = db.features

# # Define the specific category to delete
# category_to_delete = "minimal"

# # Delete documents with the specified category
# delete_result = features_collection.delete_many({'category': category_to_delete})

# print(f'Successfully deleted {delete_result.deleted_count} documents with category: {category_to_delete}')