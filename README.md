# AI Music Recommendation System

## Overview

This project is a content-based music recommendation system that suggests similar songs based on the user's selected track. The recommendation engine combines textual information such as artist and genre with audio characteristics including danceability, energy, loudness, tempo, valence, and other musical features to generate relevant recommendations.

The application allows users to search for a song, choose the correct version when multiple songs share the same title, and receive the top five similar songs along with their similarity scores. Users can also open any recommended song directly in **YouTube Music** for listening.

The project is built using **Flask** for the backend and **HTML, CSS, and JavaScript** for the frontend, while the recommendation engine is developed using **Scikit-learn** and other Python data science libraries.

---

## Features

* Search songs by title or artist
* Content-based recommendation system using hybrid features
* Top 5 song recommendations with similarity scores
* Direct redirection to YouTube Music
* Fast recommendation generation using precomputed feature vectors
* Simple and responsive web interface

---

## Technologies Used

* Python
* Flask
* Pandas
* NumPy
* Scikit-learn
* SciPy
* Joblib
* HTML
* CSS
* JavaScript

---

## How It Works

The recommendation engine follows these steps:

1. Data cleaning and preprocessing
2. Removal of duplicate songs
3. Feature engineering
4. TF-IDF vectorization of textual features (artist and genre)
5. Standardization of numerical audio features
6. Combination of text and audio feature vectors
7. Cosine similarity computation
8. Retrieval of the top five most similar songs

---

## Recommendation Approach

This project uses a **hybrid content-based filtering** approach.

Text-based similarity is calculated using **TF-IDF Vectorization** on artist and genre information, while numerical audio features such as danceability, energy, loudness, speechiness, acousticness, instrumentalness, liveness, valence, and tempo are standardized and combined with the text vectors.

The final recommendations are generated using **Cosine Similarity**, ensuring that suggested songs are musically and contextually similar to the selected track.

---

## Project Structure

```text
Music-Recommendation-System/

│── app.py
│── requirements.txt
│── dataset.csv
│── df.pkl
│── combined_vectors.pkl
│── scaler.pkl
│── tfidf.pkl

├── templates/
├── static/
│    ├── css/
│    └── js/
```

---

## Future Enhancements

* Album artwork integration
* Mood-based music recommendations
* Playlist generation
* User authentication and personalized recommendations
* Advanced search filters
* Recommendation explanations based on feature similarity

---

## Conclusion

This project demonstrates the implementation of a real-world recommendation system by combining machine learning techniques with web development. It showcases data preprocessing, feature engineering, vectorization, similarity computation, and deployment of a complete Flask application with an interactive user interface and seamless integration with YouTube Music.
