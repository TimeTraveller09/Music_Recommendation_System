document.addEventListener('DOMContentLoaded', () => {
    const songInput = document.getElementById('song-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    const btnSubmit = document.getElementById('btn-submit');
    const loader = document.getElementById('loader');
    const resultsSection = document.getElementById('results');
    const recList = document.getElementById('rec-list');
    const errorToast = document.getElementById('error-toast');
    const toastMessage = document.getElementById('toast-message');

    let selectedSong = null;
    let debounceTimer;

    // Input autocomplete search with debounce
    songInput.addEventListener('input', function () {
        const query = this.value.trim();
        btnSubmit.disabled = true;

        clearTimeout(debounceTimer);
        if (!query) {
            closeDropdown();
            return;
        }

        debounceTimer = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    showDropdown(data);
                })
                .catch(err => {
                    console.error('Search error:', err);
                });
        }, 200);
    });

    // Handle focus out and clicks outside autocomplete
    document.addEventListener('click', function (e) {
        if (e.target !== songInput && e.target !== autocompleteList) {
            closeDropdown();
        }
    });

    function showDropdown(items) {
        autocompleteList.innerHTML = '';

        if (items.length === 0) {
            autocompleteList.innerHTML = '<div class="no-results">No matches found. Try typing another song title.</div>';
            autocompleteList.classList.add('show');
            return;
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.innerHTML = `
                <div class="autocomplete-song">${item.track_name}</div>
                <div class="autocomplete-artist">${item.artists}</div>
            `;
            div.addEventListener('click', () => {
                selectSong(item);
            });
            autocompleteList.appendChild(div);
        });
        autocompleteList.classList.add('show');
    }

    function closeDropdown() {
        autocompleteList.classList.remove('show');
    }

    function selectSong(song) {
        selectedSong = song;
        songInput.value = `${song.track_name} - ${song.artists}`;
        btnSubmit.disabled = false;
        closeDropdown();
    }

    // Show Toast
    function showToast(message) {
        toastMessage.textContent = message;
        errorToast.classList.add('show');
        setTimeout(() => {
            errorToast.classList.remove('show');
        }, 4000);
    }

    // Fetch Recommendations
    btnSubmit.addEventListener('click', function () {
        if (!selectedSong) return;

        // Show loader and hide old results
        loader.style.display = 'flex';
        resultsSection.style.display = 'none';
        btnSubmit.disabled = true;

        const url = `/api/recommend?song_name=${encodeURIComponent(selectedSong.track_name)}&artist=${encodeURIComponent(selectedSong.artists)}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Server error') });
                }
                return response.json();
            })
            .then(data => {
                displayRecommendations(data);
            })
            .catch(err => {
                showToast(err.message || 'Could not fetch recommendations');
            })
            .finally(() => {
                loader.style.display = 'none';
                btnSubmit.disabled = false;
            });
    });

    function displayRecommendations(data) {
        // Set seed banner
        document.getElementById('seed-name').textContent = data.searched_song.track_name;
        document.getElementById('seed-artist').textContent = `by ${data.searched_song.artist}`;
        document.getElementById('seed-genre').textContent = data.searched_song.genre || 'General';

        // Clear old list
        recList.innerHTML = '';

        // Populate recommendations
        data.recommendations.forEach((rec) => {
            const card = document.createElement('div');
            card.className = 'rec-card';
            card.innerHTML = `
                <div class="rec-card-main">
                    <div class="vinyl-art-wrapper">
                        <div class="vinyl-disc"></div>
                        <div class="vinyl-center">
                            <span>🎵</span>
                        </div>
                    </div>
                    <div class="rec-info">
                        <div class="rec-name">${rec.track_name}</div>
                        <div class="rec-artist-genre">
                            <span class="rec-artist">${rec.artists}</span>
                            <div class="dot-divider"></div>
                            <span class="rec-genre-tag">${rec.track_genre}</span>
                        </div>
                    </div>
                </div>
                <div class="rec-card-actions">
                    <div class="score-container">
                        <div class="score-badge">
                            <div class="equalizer">
                                <div class="equalizer-bar"></div>
                                <div class="equalizer-bar"></div>
                                <div class="equalizer-bar"></div>
                                <div class="equalizer-bar"></div>
                            </div>
                            <span>${rec.similarity}%</span>
                        </div>
                        <span class="score-label">Match Score</span>
                    </div>
                    <a class="listen-btn" href="${rec.youtube_music}" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Play Track
                    </a>
                </div>
            `;
            recList.appendChild(card);
        });

        // Show results
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
