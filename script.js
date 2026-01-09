const form = document.getElementById("review-form");
const bookList = document.getElementById("book-list");
const ratingInput = document.getElementById("rating");
const submitBtn = document.getElementById("submit-btn");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const themeBtn = document.getElementById("toggle-theme");

let reviews = loadReviews();
let editingId = null;

/* ---------- INIT ---------- */
renderReviews();

/* ---------- EVENTS ---------- */
form.addEventListener("submit", handleAddReview);
searchInput.addEventListener("input", handleSearch);
sortSelect.addEventListener("change", handleSort);
themeBtn.addEventListener("click", toggleTheme);

/* ---------- FUNCTIONS ---------- */

function handleAddReview(e) {
    e.preventDefault();

    const review = getFormData();
    if (!review) return;

    if (editingId) {
        reviews = reviews.map(r =>
            r.id === editingId ? { ...review, id: editingId } : r
        );
        editingId = null;
        submitBtn.textContent = "Submit Review";
    } else {
        reviews.push(review);
    }

    saveReviews();
    renderReviews();
    form.reset();
}

function getFormData() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const text = document.getElementById("review").value.trim();
    const rating = ratingInput.value;

    if (!title || !author || !text || !rating) {
        alert("Please fill out all fields ⭐");
        return null;
    }

    return {
        id: Date.now(),
        title,
        author,
        text,
        rating
    };
}

function renderReviews(list = reviews) {
    bookList.innerHTML = "";
    list.forEach(createBookCard);
}

function createBookCard(book) {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
        <h2>${book.title}</h2>
        <p class="author">by ${book.author}</p>
        <p>${book.rating}</p>
        <p>${book.text}</p>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
    `;

    card.querySelector(".edit").addEventListener("click", () => editReview(book.id));
    card.querySelector(".delete").addEventListener("click", () => deleteReview(book.id));

    bookList.appendChild(card);
}

function editReview(id) {
    const book = reviews.find(r => r.id === id);

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("review").value = book.text;
    ratingInput.value = book.rating;

    editingId = id;
    submitBtn.textContent = "Update Review";
}

function deleteReview(id) {
    reviews = reviews.filter(r => r.id !== id);
    saveReviews();
    renderReviews();
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = reviews.filter(book =>
        book.title.toLowerCase().includes(term)
    );
    renderReviews(filtered);
}

function handleSort(e) {
    let sorted = [...reviews];

    if (e.target.value === "high") {
        sorted.sort((a, b) => b.rating.length - a.rating.length);
    } else if (e.target.value === "low") {
        sorted.sort((a, b) => a.rating.length - b.rating.length);
    }

    renderReviews(sorted);
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

function saveReviews() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function loadReviews() {
    return JSON.parse(localStorage.getItem("reviews")) || [];
}