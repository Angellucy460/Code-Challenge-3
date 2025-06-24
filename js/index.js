const API_URL = "http://localhost:3000/posts";

const anything = document.getElementById("h");
const angel = document.querySelector(".add-post-section button");
const liona = document.getElementById("cancel-edit");

angel.addEventListener("click", function () {
    anything.classList.remove("lucy");
});

liona.addEventListener("click", function () {
    anything.classList.add("lucy");
});
function main() {
    displayPosts();
    addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);

// display all post titles
function displayPosts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(posts => {
            const postList = document.querySelector(".post-list");
            postList.innerHTML = '';
            posts.forEach(post => {
                const postEl = document.createElement("li");
                postEl.className = "post-list-item";
                postEl.innerHTML = `
                    <div>
                        <span class="post-title">${post.title}</span>
                        <span class="post-meta">${post.author}</span>
                    </div>
                `;
                postEl.addEventListener("click", () => handlePostClick(post.id));
                postList.appendChild(postEl);
            });
            // Optionally: show first post
            if (posts.length > 0) {
                handlePostClick(posts[0].id);
            }
            // Update post count
            document.querySelector(".post-count").textContent = `${posts.length} post${posts.length !== 1 ? "s" : ""}`;
        });
}

// show post detail
function handlePostClick(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(post => {
            const detail = document.querySelector(".post-detail-section");
            detail.innerHTML = `
                <div class="post-detail-card">
                    <div class="post-detail-header">
                        <div>
                            <h2>${post.title}</h2>
                            <p class="post-meta">By ${post.author}</p>
                        </div>
                        <div class="post-actions">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                    <img src="${post.image}" alt="post image" class="post-image"/>
                    <p>${post.content}</p>
                </div>
            `;
            // Add event listeners for edit and delete
            detail.querySelector(".edit-btn").onclick = () => showEditForm(post.id);
            detail.querySelector(".delete-btn").onclick = () => deletePost(post.id);
        });
}

// Add new post
function addNewPostListener() {
    document.getElementById("new-post-form").addEventListener("submit", e => {
        e.preventDefault();
        const newPost = {
            title: document.getElementById("new-title").value,
            content: document.getElementById("new-content").value,
            author: document.getElementById("new-author").value,
            image: document.getElementById("new-image").value,
        };
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost)
        }).then(() => {
            displayPosts();
            e.target.reset();
        });
    });
}

// show edit form (simple inline edit for demo)
function showEditForm(postId) {
    fetch(`${API_URL}/${postId}`)
        .then(res => res.json())
        .then(post => {
            const detail = document.querySelector(".post-detail-section");
            detail.innerHTML = `
                <div class="post-detail-card">
                    <form id="edit-post-form">
                        <input type="text" id="edit-title" value="${post.title}" required />
                        <input type="text" id="edit-author" value="${post.author}" required />
                        <input type="text" id="edit-image" value="${post.image}" required />
                        <textarea id="edit-content" required>${post.content}</textarea>
                        <div class="form-actions">
                            <button type="submit" class="add-btn">Save</button>
                            <button type="button" id="cancel-edit" class="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById("edit-post-form").onsubmit = function(e) {
                e.preventDefault();
                const updated = {
                    title: document.getElementById("edit-title").value,
                    author: document.getElementById("edit-author").value,
                    image: document.getElementById("edit-image").value,
                    content: document.getElementById("edit-content").value,
                };
                fetch(`${API_URL}/${postId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updated)
                }).then(() => {
                    displayPosts();
                });
            };
            document.getElementById("cancel-edit").onclick = function() {
                handlePostClick(postId);
            };
        });
}

// delete post
function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    fetch(`${API_URL}/${postId}`, {
        method: "DELETE"
    }).then(() => {
        document.querySelector(".post-detail-section").innerHTML = "";
        displayPosts();
    });
}