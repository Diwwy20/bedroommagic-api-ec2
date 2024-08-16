from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.models import Model
import numpy as np

class FeatureExtractor:
    def __init__(self):
        base_model = VGG16(weights="imagenet", include_top=False, pooling='max', input_shape=(320, 320, 3))
        self.model = Model(inputs=base_model.input, outputs=base_model.output)
        
    def extract(self, img):
        img = img.resize((320, 320)).convert("RGB")
        x = image.img_to_array(img) # To np.array
        x = np.expand_dims(x, axis=0) # (H, W, C) -> (1, H, W, C)
        x = preprocess_input(x) # Subtract avg pixel value
        feature = self.model.predict(x)[0] # (1, 512) -> (512, )
        return feature / np.linalg.norm(feature) # Normalize 