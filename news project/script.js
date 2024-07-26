const apiKey = "3d0c9a4fc9554457a22ecfc5dea84f83";

const blogContainer = document.getElementById("bolg-container");
const load = document.getElementById("more1");
let currentPage = 1;
let currentQuery = ""; // To store the current search query
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');



async function fetchRandomNews(page) {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=12&page=${page}&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}



async function fetchNewsQuery(query, page) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=12&page=${page}&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}



searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            blogContainer.innerHTML = ''; // Clear the current articles
            currentPage = 1; // Reset the current page
            currentQuery = query; // Set the current query
            const articles = await fetchNewsQuery(query, currentPage); // Start from the first page
            displayBlogs(articles);
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    }
});



function displayBlogs(articles) {
    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || 'placeholder.jpg'; // Add a placeholder image if none
        img.alt = article.title;

        const title = document.createElement("h2");
        const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes = article.description && article.description.length > 120 ? article.description.slice(0, 120) + "..." : article.description;
        description.textContent = truncatedDes;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        blogContainer.appendChild(blogCard);
    });
}



(async () => {
    try {
        const articles = await fetchRandomNews(currentPage);
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news", error);
    }
})();


load.addEventListener('click', async () => {
    try {
        load.classList.add('loading');
        currentPage++;
        let articles;
        if (currentQuery) {
            articles = await fetchNewsQuery(currentQuery, currentPage); // Load more related news
        } else {
            articles = await fetchRandomNews(currentPage); // Load more random news
        }
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news", error);
    } finally {
        load.classList.remove('loading');
    }
});
