from flask import Flask, request, render_template, jsonify
import tensorflow as tf 
from keras.models import load_model
from keras.preprocessing.image import img_to_array, load_img
import numpy as np
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

model = load_model('model/model.h5')
class_names = ['Culcita novaguineae', 'Linckia laevigata', 'Luidia foliolata', 'Protoreaster nodosus']

def preprocess_image(image_path, target_size):
    img = load_img(image_path, target_size=target_size)
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img/255.0
    return img

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)

        img = preprocess_image(filepath, target_size=(224,224))

        predictions = model.predict(img)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class_name = class_names[predicted_class_index]

        os.remove(filepath)

        return jsonify({'prediction': predicted_class_name})


if __name__ == "__main__":
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)