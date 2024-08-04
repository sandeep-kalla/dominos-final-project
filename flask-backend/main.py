from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from collections import Counter
import datetime
import os

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient("mongodb+srv://root:root@cluster0.d2wlybb.mongodb.net/")
db = client.dominos

def serialize_object_id(document):
    """Convert ObjectId fields to strings."""
    if isinstance(document, dict):
        for key, value in document.items():
            if isinstance(value, dict):
                serialize_object_id(value)
            elif isinstance(value, list):
                for item in value:
                    serialize_object_id(item)
            elif isinstance(value, ObjectId):
                document[key] = str(value)
    return document

def get_user_data(user_id=None):
    users_collection = db['google-users']
    if user_id:
        users = list(users_collection.find({"uid": user_id}, {"cartItems": 1}))
    else:
        users = list(users_collection.find({}, {"cartItems": 1}))
    users = [serialize_object_id(user) for user in users]
    return users

def get_pizza_data():
    pizzas_collection = db['pizzas']
    pizzas = list(pizzas_collection.find({}))
    pizzas = [serialize_object_id(pizza) for pizza in pizzas]
    return pizzas

def recommend_pizzas(users, pizzas):
    pizza_counter = Counter()

    for user in users:
        for item in user.get("cartItems", []):
            pizza_counter[item["id"]] += item.get("quantity", 1)  # Use quantity to count

    # Get the top 5 most common pizzas or fewer if there aren't 5 unique pizzas
    most_common_pizzas = pizza_counter.most_common(5)

    recommended_pizzas = []
    for pizza_id, _ in most_common_pizzas:
        for pizza in pizzas:
            if pizza["id"] == pizza_id:
                recommended_pizzas.append(pizza)
                break

    return recommended_pizzas

def store_recommendations(recommendations):
    recommendations_collection = db['recommendations']
    recommendation_data = {
        "recommendations": recommendations,
        "timestamp": datetime.datetime.utcnow()
    }
    recommendations_collection.insert_one(serialize_object_id(recommendation_data))

def get_top_recommendations():
    recommendations_collection = db['recommendations']

    # Aggregate recommendations to find the top 5 most frequent pizzas
    pipeline = [
        {"$unwind": "$recommendations"},
        {"$group": {"_id": "$recommendations.id", "count": {"$sum": "$recommendations.quantity"}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
        {"$lookup": {
            "from": "pizzas",
            "localField": "_id",
            "foreignField": "id",
            "as": "pizzaDetails"
        }},
        {"$unwind": "$pizzaDetails"},
        {"$project": {"_id": 0, "pizzaDetails": 1}}
    ]

    top_recommendations = list(recommendations_collection.aggregate(pipeline))
    return [serialize_object_id(item["pizzaDetails"]) for item in top_recommendations]

@app.route('/')
def home():
    return "Pizza Recommendation System"

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    user_id = request.args.get('uid')  # Get uid from query parameters

    if user_id:
        # Generate recommendations for the logged-in user
        users = get_user_data(user_id=user_id)
    else:
        # Generate basic recommendations for non-logged-in users
        users = get_user_data()
    
    pizzas = get_pizza_data()
    recommendations = recommend_pizzas(users, pizzas)
    
    # Store the new recommendations
    store_recommendations(recommendations)
    
    return jsonify(recommendations)

@app.route('/recommendations/top', methods=['GET'])
def get_top_recommendations_route():
    top_recommendations = get_top_recommendations()
    return jsonify(top_recommendations)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))  # Default to port 5000 if PORT is not set
    app.run(host='0.0.0.0', port=port, debug=True)
