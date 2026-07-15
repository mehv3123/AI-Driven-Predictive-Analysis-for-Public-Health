from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

print("Loading Khairo23/symptoms-biobert model... please wait.")

model_name = "Khairo23/symptoms-biobert"

try:
    classifier = pipeline("text-classification", model=model_name)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Please ensure the model name is correct and you have an internet connection.")
    exit(1)

label_map = {
    "LABEL_0": "Psoriasis",
    "LABEL_1": "Varicose Veins",
    "LABEL_2": "Typhoid",
    "LABEL_3": "Chicken Pox",
    "LABEL_4": "Impetigo",
    "LABEL_5": "Dengue",
    "LABEL_6": "Fungal Infection",
    "LABEL_7": "Common Cold",
    "LABEL_8": "Pneumonia",
    "LABEL_9": "Dimorphic Hemorrhoids(piles)",
    "LABEL_10": "Arthritis",
    "LABEL_11": "Acne",
    "LABEL_12": "Hepatitis B",
    "LABEL_13": "Peptic Ulcer Disease",
    "LABEL_14": "Drug Reaction",
    "LABEL_15": "AIDS",
    "LABEL_16": "Diabetes",
    "LABEL_17": "Gastroenteritis",
    "LABEL_18": "Bronchial Asthma",
    "LABEL_19": "Hypertension",
    "LABEL_20": "Migraine",
    "LABEL_21": "Cervical Spondylosis",
    "LABEL_22": "Jaundice",
    "LABEL_23": "Malaria",
    "LABEL_24": "Urinary Tract Infection",
    "LABEL_25": "Allergy",
    "LABEL_26": "Hepatitis C",
    "LABEL_27": "Hepatitis E",
    "LABEL_28": "Hepatitis D",
    "LABEL_29": "Heart Attack",
    "LABEL_30": "Hypothyroidism",
    "LABEL_31": "Hyperthyroidism",
    "LABEL_32": "Hypoglycemia",
    "LABEL_33": "Osteoarthritis",
    "LABEL_34": "Paroxysmal Positional Vertigo",
    "LABEL_35": "GERD (Gastroesophageal Reflux Disease)"
}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symptoms_text = data.get('symptoms', '')

        if not symptoms_text:
            return jsonify({"error": "No symptoms provided"}), 400

        result = classifier(symptoms_text)
        
        raw_label = result[0]['label']
        
        predicted_disease = label_map.get(raw_label, raw_label)

        print(f"Input: {symptoms_text} -> Raw: {raw_label} -> Prediction: {predicted_disease}")

        return jsonify({"disease": predicted_disease})

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Prediction failed"}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)