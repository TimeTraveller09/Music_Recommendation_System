import os
import joblib
from flask import Flask, render_template, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import urllib.parse

app = Flask(__name__)

# Load the models
print("Loading data and vectors...")
df = joblib.load("df.pkl")
combined_vectors = joblib.load("combined_vectors.pkl")
print("Data loaded successfully!")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/search", methods=["GET"])
def api_search():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify([])
    
    # Simple search
    mask = (
        df["track_name"].str.contains(query, case=False, na=False) |
        df["artists"].str.contains(query, case=False, na=False)
    )
    results = df[mask][["track_name", "artists"]].drop_duplicates().head(8)
    
    # Convert to list of dicts
    search_results = []
    for idx, row in results.iterrows():
        search_results.append({
            "track_name": row["track_name"],
            "artists": row["artists"]
        })
    return jsonify(search_results)

@app.route("/api/recommend", methods=["GET"])
def api_recommend():
    song_name = request.args.get("song_name", "").strip()
    artist = request.args.get("artist", "").strip()
    
    if not song_name or not artist:
        return jsonify({"error": "Missing parameters"}), 400
        
    song_name_lower = song_name.lower().strip()
    artist_lower = artist.lower().strip()

    song = df[
        (df["track_name"].str.lower().str.strip() == song_name_lower) &
        (df["artists"].str.lower().str.strip() == artist_lower)
    ]
    
    if song.empty:
        return jsonify({"error": "Song not found"}), 404
        
    positional_index = df.index.get_loc(song.index[0])
    
    # Calculate similarity
    similarity_scores = cosine_similarity(
        combined_vectors[positional_index].reshape(1, -1), combined_vectors
    ).flatten()
    
    top_indices = similarity_scores.argsort()[::-1][1:6]
    
    recommendations = df.iloc[top_indices][["track_name", "artists", "track_genre"]].copy()
    recommendations["similarity"] = (similarity_scores[top_indices] * 100).round(2)

    rec_list = []

    for idx, row in recommendations.iterrows():

        query = f"{row['track_name']} {row['artists']}"

        yt_url = (
            "https://music.youtube.com/search?q=" +
            urllib.parse.quote(query)
        )

        rec_list.append({
            "track_name": row["track_name"],
            "artists": row["artists"],
            "track_genre": row["track_genre"],
            "similarity": float(row["similarity"]),
            "youtube_music": yt_url
        })
        
    return jsonify({
        "searched_song": {
            "track_name": song.iloc[0]["track_name"],
            "artist": song.iloc[0]["artists"],
            "genre": song.iloc[0]["track_genre"] if "track_genre" in song.columns else "Unknown"
        },
        "recommendations": rec_list
    })

@app.route("/style.css")
def serve_style():
    return render_template("style.css"), 200, {"Content-Type": "text/css"}

if __name__ == "__main__":
    app.run(debug=True, port=5001)