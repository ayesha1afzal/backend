# # # from flask import Flask, jsonify
# # # from pymongo import MongoClient
# # # from sklearn.feature_extraction.text import TfidfVectorizer
# # # from sklearn.metrics.pairwise import cosine_similarity
# # # import pandas as pd
# # # from flask import request
# # # from flask_cors import CORS
# # # import numpy as np

# # # # Initialize Flask app
# # # app = Flask(__name__)
# # # CORS(app)
# # # @app.route("/get_server_url", methods=["GET"])
# # # def get_server_url():
# # #     return jsonify({"server_url": request.host_url})

# # # # MongoDB connection
# # # client = MongoClient("mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority")
# # # db = client["SwapIt"]
# # # collection = db["MergedCollection"]
# # # # @app.route("/Login", methods=["POST"])


# # # def fetch_data_from_mongodb():
# # #     """Fetch all data from MongoDB MergedCollection and convert it to a DataFrame."""
# # #     data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's default _id field
# # #     df = pd.DataFrame(data)
# # #     print("Columns in DataFrame:", df.columns)  # Debugging output
# # #     return df


# # # # def recommend_users(user_id):
# # # #     df = fetch_data_from_mongodb()

# # # #     # Find the user by user_id
# # # #     user_row = df[df["User ID"] == user_id]
# # # #     if user_row.empty:
# # # #         return {"error": "User not found"}
    
# # # #     user_data = user_row.iloc[0]  # Extract user details
# # # #     wanted_category = user_data["Category (Skills I Want)"]
# # # #     wanted_skill = user_data["Skills I Want"]

# # # #     # Find users who have this category in "skills_i_have"
# # # #     matching_users = df[df["Category (skills_i_have)"] == wanted_category]
# # # #     matching_users = matching_users[matching_users["User ID"] != user_id]

# # # #     # Apply TF-IDF and cosine similarity
# # # #     vectorizer = TfidfVectorizer()
# # # #     tfidf_matrix = vectorizer.fit_transform(matching_users["skills_i_have"].astype(str))
# # # #     user_tfidf = vectorizer.transform([wanted_skill])

# # # #     similarity_scores = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
# # # #     matching_users["Similarity Score"] = similarity_scores

# # # #     # Get top 10 recommended users
# # # #     top_10_recommendations = matching_users.sort_values(by="Similarity Score", ascending=False).head(10)
    
# # # #     return user_data.to_dict(), top_10_recommendations.to_dict(orient="records")
# # # # def recommend_users(email):
# # # #     df = fetch_data_from_mongodb()

# # # #     # Find the user by email
# # # #     user_row = df[df["email"] == email]  # Updated from user_id to email
# # # #     if user_row.empty:
# # # #         return {"error": "User not found"}
    
# # # #     user_data = user_row.iloc[0]  # Extract user details
# # # #     wanted_category = user_data["category_skills_i_want"]  # Corrected field name
# # # #     wanted_skill = user_data["skills_i_want"]


# # # #     # **STEP 1: Find exact skill matches**
# # # #     matching_users = df[df["skills_i_have"].str.contains(wanted_skill, case=False, na=False)]
# # # #     matching_users = matching_users[matching_users["email"] != email]  # Exclude current user

# # # #     if matching_users.empty:
# # # #         # **STEP 2: No exact match, search by category**
# # # #         matching_users = df[df["category_skills_i_have"] == wanted_category]
# # # #         matching_users = matching_users[matching_users["email"] != email]

# # # #     if matching_users.empty:
# # # #         return user_data.to_dict(), []  # No matches at all

# # # #     # **STEP 3: Apply TF-IDF similarity on "skills_i_have"**
# # # #     vectorizer = TfidfVectorizer()
# # # #     tfidf_matrix = vectorizer.fit_transform(matching_users["skills_i_have"].astype(str))
# # # #     user_tfidf = vectorizer.transform([wanted_skill])

# # # #     similarity_scores = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
# # # #     matching_users["Similarity Score"] = similarity_scores

# # # #     # **STEP 4: Return top 10 recommendations**
# # # #     top_recommendations = matching_users.sort_values(by="Similarity Score", ascending=False).head(10)
# # # #     print(df.columns)  # Check available columns
# # # #     print(user_data)
    
# # # #     return user_data.to_dict(), top_recommendations.to_dict(orient="records")

# # # # def recommend_users(email):
# # # #     df = fetch_data_from_mongodb()

# # # #     # Find the user by email
# # # #     user_row = df[df["email"] == email]  # Ensure column matches DataFrame
# # # #     if user_row.empty:
# # # #         return {"error": "User not found"}

# # # #     user_data = user_row.iloc[0]  # Extract user details
# # # #     wanted_skill = user_data["skills_i_want"]
# # # #     wanted_category = user_data["category_skills_i_want"]

# # # #     # **Step 1: Find exact skill matches**
# # # #     skill_matches = df[df["skills_i_have"].str.contains(wanted_skill, case=False, na=False)]
# # # #     skill_matches = skill_matches[skill_matches["email"] != email]  # Exclude current user

# # # #     # **Step 2: If no exact match, find category matches**
# # # #     category_matches = df[df["category_skills_i_have"] == wanted_category]
# # # #     category_matches = category_matches[category_matches["email"] != email]

# # # #     # **Combine both matches (Skill matches first, then category matches)**
# # # #     recommended_users = pd.concat([skill_matches, category_matches]).drop_duplicates()

# # # #     return user_data.to_dict(), recommended_users.to_dict(orient="records")
# # # import pandas as pd

# # # def recommend_users(email):
# # #     df = fetch_data_from_mongodb()

# # #     # Find the user by email
# # #     user_row = df[df["email"] == email]
# # #     if user_row.empty:
# # #         return {"error": "User not found"}

# # #     user_data = user_row.iloc[0]

# # #     wanted_skill = user_data["skills_i_want"]
# # #     wanted_category = user_data["category_skills_i_want"]

# # #     # Step 1: Skill match (based on skill name)
# # #     skill_matches = df[
# # #         (df["skills_i_have"].str.contains(wanted_skill, case=False, na=False)) &
# # #         (df["email"] != email)
# # #     ]

# # #     # Step 2: Category match (based on category name)
# # #     category_matches = df[
# # #         (df["category_skills_i_have"] == wanted_category) &
# # #         (df["email"] != email)
# # #     ]

# # #     # Combine both sets of matches (avoid duplicates)
# # #     # recommended_users = pd.concat([skill_matches, category_matches]).drop_duplicates()
# # #     recommended_users = pd.concat([skill_matches, category_matches], ignore_index=True).drop_duplicates(subset="email")


# # #     # Clean user details
# # #     user_data_clean = {
# # #         key: (None if pd.isna(value) else value.item() if hasattr(value, "item") and not isinstance(value, (list, dict)) else value)
# # #         for key, value in user_data.items()
# # #     }


# # #     # Clean recommended users
# # #     recommended_users_clean = []
# # #     for _, row in recommended_users.iterrows():
# # #         cleaned_row = {
# # #         key: (None if pd.isna(value) else value.item() if hasattr(value, "item") and not isinstance(value, (list, dict)) else value)
# # #         for key, value in row.items()
# # #     }

# # #         recommended_users_clean.append(cleaned_row)

# # #     return {
# # #         "user_details": user_data_clean,
# # #         "recommended_users": recommended_users_clean
# # #     }


# # # @app.route("/recommend", methods=["GET"])
# # # def get_recommendations():
# # #     email = request.args.get("email")
# # #     if not email:
# # #         return jsonify({"error": "Email is required"}), 400

# # #     result = recommend_users(email)
# # #     if result is None:  # 🔥 ADD THIS CHECK
# # #         return jsonify({"error": "Recommendation failed"}), 500

# # #     return jsonify(result)


# # # if __name__ == "__main__":
# # #     app.run(host= '0.0.0.0', port=5500 , debug=True) 
# # from flask import Flask, jsonify, request
# # from flask_cors import CORS
# # from pymongo import MongoClient
# # import pandas as pd

# # # Initialize Flask app
# # app = Flask(__name__)
# # CORS(app)

# # # MongoDB connection
# # client = MongoClient("mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority")
# # db = client["SwapIt"]
# # collection = db["MergedCollection"]

# # @app.route("/get_server_url", methods=["GET"])
# # def get_server_url():
# #     return jsonify({"server_url": request.host_url})


# # def fetch_data_from_mongodb():
# #     """Fetch all data from MongoDB MergedCollection and convert it to a DataFrame."""
# #     data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's _id field
# #     df = pd.DataFrame(data)
# #     return df


# # def recommend_users(email):
# #     df = fetch_data_from_mongodb()

# #     # Find the current user
# #     user_row = df[df["email"] == email]
# #     if user_row.empty:
# #         return None

# #     user_data = user_row.iloc[0]
# #     wanted_skill = user_data["skills_i_want"]
# #     wanted_category = user_data["category_skills_i_want"]

# #     # Step 1: Skill match
# #     skill_matches = df[
# #         (df["skills_i_have"].str.contains(wanted_skill, case=False, na=False)) &
# #         (df["email"] != email)
# #     ]
# #     skill_matches["match_type"] = "skill"

# #     # Step 2: Category match (excluding already matched emails)
# #     category_matches = df[
# #         (df["category_skills_i_have"] == wanted_category) &
# #         (df["email"] != email) &
# #         (~df["email"].isin(skill_matches["email"]))
# #     ]
# #     category_matches["match_type"] = "category"

# #     # Combine and clean
# #     recommended_users = pd.concat([skill_matches, category_matches], ignore_index=True)

# #     # Clean user info
# #     user_data_clean = {
# #         key: (None if pd.isna(value) else value.item() if hasattr(value, "item") and not isinstance(value, (list, dict)) else value)
# #         for key, value in user_data.items()
# #     }

# #     # Clean recommended users
# #     recommended_users_clean = []
# #     for _, row in recommended_users.iterrows():
# #         cleaned_row = {
# #             key: (None if pd.isna(value) else value.item() if hasattr(value, "item") and not isinstance(value, (list, dict)) else value)
# #             for key, value in row.items()
# #         }
# #         recommended_users_clean.append(cleaned_row)

# #     return {
# #         "user_details": user_data_clean,
# #         "recommended_users": recommended_users_clean
# #     }


# # @app.route("/recommend", methods=["GET"])
# # def get_recommendations():
# #     email = request.args.get("email")
# #     if not email:
# #         return jsonify({"error": "Email is required"}), 400

# #     result = recommend_users(email)
# #     if result is None:
# #         return jsonify({"error": "Recommendation failed or user not found"}), 404

# #     return jsonify(result)


# # if __name__ == "__main__":
# #     app.run(host="0.0.0.0", port=5500, debug=True)
# from flask import Flask, jsonify, request
# from bson import ObjectId  # Add this at the top
# from flask_cors import CORS
# from pymongo import MongoClient
# import pandas as pd
# import numpy as np

# # -------------------- Flask Setup --------------------
# app = Flask(__name__)
# # CORS(app)
# CORS(app, resources={r"/*": {"origins": "*"}})

# # -------------------- MongoDB Connection --------------------
# client = MongoClient("mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority")
# db = client["SwapIt"]
# collection = db["MergedCollection"]

# # -------------------- Utility: Safe Value Cleaning --------------------
# # def safe_clean(value):
# #     if isinstance(value, float) and pd.isna(value):
# #         return None
# #     if isinstance(value, list):
# #         return [safe_clean(v) for v in value if v is not None] or None
# #     if isinstance(value, (np.int64, np.int32, np.float32, np.float64)):
# #         return value.item()
# #     return value

# def safe_clean(value):
#     if isinstance(value, ObjectId):
#         return str(value)  # Convert ObjectId to string
#     if isinstance(value, float) and pd.isna(value):
#         return None
#     if isinstance(value, list):
#         return [safe_clean(v) for v in value if v is not None] or None
#     if isinstance(value, (np.int64, np.int32, np.float32, np.float64)):
#         return value.item()
#     return value

# # -------------------- Fetch Data from MongoDB --------------------
# # def fetch_data_from_mongodb():
# #     data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's _id
# #     df = pd.DataFrame(data)
# #     return df

# def fetch_data_from_mongodb():
#     data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's _id
#     df = pd.DataFrame(data)

#     # Apply the safe_clean function to clean all the fields in the DataFrame
#     for col in df.columns:
#         df[col] = df[col].apply(safe_clean)

#     return df

# # -------------------- Recommendation Logic --------------------
# # def recommend_users(email):
# #     df = fetch_data_from_mongodb()
# #     user_row = df[df["email"] == email]

# #     if user_row.empty:
# #         return None

# #     user_data = user_row.iloc[0]
# #     wanted_skill = safe_clean(user_data.get("skills_i_want"))
# #     wanted_category = safe_clean(user_data.get("category_skills_i_want"))

# #     # Filter out current user
# #     other_users = df[df["email"] != email]

# #     # Handle list and string skill types
# #     other_users["skills_i_have"] = other_users["skills_i_have"].astype(str)

# #     # Step 1: Match on skills
# #     skill_matches = other_users[
# #         other_users["skills_i_have"].str.contains(str(wanted_skill), case=False, na=False)
# #     ].copy()
# #     skill_matches["match_type"] = "skill"

# #     # Step 2: Match on category if not in skill matches
# #     category_matches = other_users[
# #         (other_users["category_skills_i_have"] == wanted_category) &
# #         (~other_users["email"].isin(skill_matches["email"]))
# #     ].copy()
# #     category_matches["match_type"] = "category"

# #     # Combine matches
# #     recommended_users = pd.concat([skill_matches, category_matches], ignore_index=True)

# #     # Clean user details
# #     user_data_clean = {k: safe_clean(v) for k, v in user_data.items()}

# #     # Clean recommended users
# #     recommended_users_clean = []
# #     for _, row in recommended_users.iterrows():
# #         cleaned_row = {k: safe_clean(v) for k, v in row.items()}
# #         recommended_users_clean.append(cleaned_row)

# #     return {
# #         "user_details": user_data_clean,
# #         "recommended_users": recommended_users_clean
# #     }
# # def recommend_users(email):
# #     df = fetch_data_from_mongodb()
# #     user_row = df[df["email"] == email]

# #     if user_row.empty:
# #         return None

# #     user_data = user_row.iloc[0]
# #     wanted_skill = safe_clean(user_data.get("skills_i_want"))
# #     wanted_category = safe_clean(user_data.get("category_skills_i_want"))

# #     # Filter out current user
# #     other_users = df[df["email"] != email]
# #     other_users["skills_i_have"] = other_users["skills_i_have"].astype(str)

# #     # Step 1: Skill match
# #     skill_matches = other_users[
# #         other_users["skills_i_have"].str.contains(str(wanted_skill), case=False, na=False)
# #     ].copy()
# #     skill_matches["match_type"] = "skill"

# #     # Step 2: Category match excluding emails already in skill_matches
# #     category_matches = other_users[
# #         (other_users["category_skills_i_have"] == wanted_category) &
# #         (~other_users["email"].isin(skill_matches["email"]))
# #     ].copy()
# #     category_matches["match_type"] = "category"

# #     # 👇 NEW: Combine and LIMIT to 10
# #     combined = pd.concat([skill_matches, category_matches], ignore_index=True)
# #     combined = combined.drop_duplicates(subset="email").head(10)

# #     # Clean user and result
# #     user_data_clean = {k: safe_clean(v) for k, v in user_data.items()}
# #     recommended_users_clean = [{k: safe_clean(v) for k, v in row.items()} for _, row in combined.iterrows()]

# #     return {
# #         "user_details": user_data_clean,
# #         "recommended_users": recommended_users_clean
# #     }


# # # -------------------- Route: /recommend --------------------

# def recommend_users(email):
#     df = fetch_data_from_mongodb()
#     user_row = df[df["email"] == email]

#     if user_row.empty:
#         return None

#     user_data = user_row.iloc[0]
#     wanted_skill = user_data.get("skills_i_want")
#     wanted_category = user_data.get("category_skills_i_want")

#     if not wanted_skill or not wanted_category:
#         print(f"User data missing skills: {user_data}")
#         return None

#     # Exclude current user
#     other_users = df[df["email"] != email].copy()
#     other_users["skills_i_have"] = other_users["skills_i_have"].astype(str)

#     # Step 1: Skill match
#     skill_matches = other_users[
#         other_users["skills_i_have"].str.contains(str(wanted_skill), case=False, na=False)
#     ].copy()
#     skill_matches["match_type"] = "skill"

#     if not skill_matches.empty:
#         combined = skill_matches
#     else:
#         # Step 2: Category match
#         category_matches = other_users[
#             other_users["category_skills_i_have"] == wanted_category
#         ].copy()
#         category_matches["match_type"] = "category"

#         if not category_matches.empty:
#             combined = category_matches
#         else:
#             # Step 3: Fallback — random 5–10 users
#            # Step 3: Fallback — random 5–10 users
#             if len(other_users) >= 1:
#                 fallback = other_users.sample(n=min(10, len(other_users))).copy()
#             else:
#                 fallback = pd.DataFrame()  # safe fallback if no other users

#             fallback["match_type"] = "random"
#             combined = fallback
#             print("Fallback Users Returned:", len(combined))
#             print("User Email:", email)


#     # Clean results
#     user_data_clean = {k: safe_clean(v) for k, v in user_data.items()}
#     recommended_users_clean = [
#         {k: safe_clean(v) for k, v in row.items()} for _, row in combined.iterrows()
#     ]

#     return {
#         "user_details": user_data_clean,
#         "recommended_users": recommended_users_clean
#     }
# @app.route("/recommend", methods=["GET"])
# def get_recommendations():
#     email = request.args.get("email")
#     if not email:
#         return jsonify({"error": "Email is required"}), 400

#     result = recommend_users(email)
#     if result is None:
#         return jsonify({"error": "User not found or no recommendations"}), 404

#     return jsonify(result)

# # -------------------- Server Runner --------------------
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5500, debug=True)
from flask import Flask, jsonify, request
from bson import ObjectId
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
from bson import json_util
import json


# -------------------- Flask Setup --------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# -------------------- MongoDB Connection --------------------
client = MongoClient("mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority")
db = client["SwapIt"]
collection = db["MergedCollection"]

# -------------------- Utility: Safe Value Cleaning --------------------
def safe_clean(value):
    if isinstance(value, ObjectId):
        return None  # or str(value) only if you want to keep it
    if isinstance(value, float) and pd.isna(value):
        return None
    if isinstance(value, list):
        return [safe_clean(v) for v in value if v is not None] or None
    if isinstance(value, (np.int64, np.int32, np.float32, np.float64)):
        return value.item()
    return value

# -------------------- Fetch Data from MongoDB --------------------
def fetch_data_from_mongodb():
    data = list(collection.find({}))  # Get all fields
    df = pd.DataFrame(data)

    for col in df.columns:
        df[col] = df[col].apply(safe_clean)

    return df

# -------------------- Recommendation Logic --------------------
def recommend_users(email):
    df = fetch_data_from_mongodb()
    user_row = df[df["email"] == email]

    if user_row.empty:
        return None

    user_data = user_row.iloc[0]
    wanted_skill = user_data.get("skills_i_want")
    wanted_category = user_data.get("category_skills_i_want")

    if not wanted_skill or not wanted_category:
        print(f"User data missing skills: {user_data}")
        return None

    other_users = df[df["email"] != email].copy()
    other_users["skills_i_have"] = other_users["skills_i_have"].astype(str)

    # Step 1: Skill match
    skill_matches = other_users[
        other_users["skills_i_have"].str.contains(str(wanted_skill), case=False, na=False)
    ].copy()
    skill_matches["match_type"] = "skill"

    if not skill_matches.empty:
        combined = skill_matches
    else:
        category_matches = other_users[
            other_users["category_skills_i_have"] == wanted_category
        ].copy()
        category_matches["match_type"] = "category"

        if not category_matches.empty:
            combined = category_matches
        else:
            if len(other_users) >= 1:
                fallback = other_users.sample(n=min(10, len(other_users))).copy()
            else:
                fallback = pd.DataFrame()
            fallback["match_type"] = "random"
            combined = fallback
            print("Fallback Users Returned:", len(combined))
            print("User Email:", email)

    user_data_clean = {k: safe_clean(v) for k, v in user_data.items() if not k.startswith("_id")}

    recommended_users_clean = []
    for _, row in combined.iterrows():
        cleaned_row = {k: safe_clean(v) for k, v in row.items()}
        
        # Remove all problematic keys
        for unwanted in ["_id", "_id_x", "_id_y", "__v", "__v_y"]:
            cleaned_row.pop(unwanted, None)
        
        recommended_users_clean.append(cleaned_row)


    return {
        "user_details": user_data_clean,
        "recommended_users": recommended_users_clean
    }

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Connected successfully"})


@app.route("/recommend", methods=["GET"])
def get_recommendations():
    print("✅ /recommend endpoint hit")  # Add this line
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    result = recommend_users(email)
    if result is None:
        return jsonify({"error": "User not found or no recommendations"}), 404
    
    # return jsonify(result)
    return json.loads(json_util.dumps(result))

# -------------------- Server Runner --------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5500, debug=True)
