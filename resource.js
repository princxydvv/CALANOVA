document.addEventListener('DOMContentLoaded', function () {
    const BING_API_KEY = 'YOUR_BING_API_KEY_HERE'; // Replace with your actual key
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent form from refreshing

        const queryInput = document.getElementById('query-input');
        const query = queryInput.value.trim();

        if (!query) {
            resultsContainer.innerHTML = '<p>Please enter a valid query.</p>';
            return;
        }

        resultsContainer.innerHTML = '<p>Loading...</p>';

        // Bing Search API endpoint
        const apiUrl = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`;

        // Fetch from Bing API
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': BING_API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.webPages && data.webPages.value.length > 0) {
                    const results = data.webPages.value.map(item => `
                    <div class="result">
                        <a href="${item.url}" target="_blank"><h4>${item.name}</h4></a>
                        <p>${item.snippet}</p>
                    </div>
                `).join('');
                    resultsContainer.innerHTML = results;
                } else {
                    resultsContainer.innerHTML = '<p>No results found.</p>';
                }
            })
            .catch(error => {
                resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            });
    });
});
