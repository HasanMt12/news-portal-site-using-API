//.............load categories data...........//

const loadCategories = () => {
        fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.data.news_category))
        .catch(error => console.log(error));
}

// load category list dependencies
const categoryDiv = document.getElementById('category-container')

//..............load news category...........//
const displayCategories = categories=>{
    
    categories.forEach(category => {

        const {category_name:name,category_id} =category        //destructuring object 

        const span = document.createElement('li')
        span.classList.add('nav-item')
        span.innerHTML= `   
        <a class="nav-link py-2 text-danger" href="#" style="padding: 0 35px;" onclick="loadNews('${category_id ? category_id : "news not found"}')" >${name}</a>
        `
        categoryDiv.appendChild(span)
    });

}
loadCategories()

const spinnerSection = document.getElementById('spinner');

// Load News and display category
    const loadNews = category => {
        // spinner start
     spinnerSection.classList.remove('d-none');
    const url = `https://openapi.programming-hero.com/api/news/category/${category}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayNews(data.data, category));
        
}


const displayNews = (allNews, category) => {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ``;

    const newsCount = document.getElementById('news-count');
    let count = 0;

    // sort news and show news 
    allNews.sort((a, b) => {
        return b.total_view - a.total_view;
    })
    allNews.forEach(news => {
        
        count++;

        //destructuring object Start
        const{title,author,thumbnail_url,total_view,details}= news
        const {img,name,published_date}=author
        //destructuring object end

        // news showing card
        const newsDiv = document.createElement('div');
        newsDiv.className = "card mb-3 bg-white p-4 shadow rounded-3";
        newsDiv.innerHTML = `
        <div class="row g-0 shadow-lg">
            <div class="col-md-2">
                <img src="${thumbnail_url}"" class="img-fluid rounded-start w-100" alt="...">
            </div>
            <div class="col-md-10 container-fluid">
                <div class="card-body d-flex flex-column h-100 justify-content-between">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${details.length > 250 ? details.slice(0, 250)+'...' : details}</p>
                    
                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-2 align-items-center">
                            <img  style="width: 40px; height: 40px; border-radius: 50%;" src="${img}" alt="">
                            <p class="mt-2">${ name?name:'unknown'}</p>
                        </div>
                        <div class="d-flex gap-2 text-danger">
                            <p><i class="fa-regular fa-eye"></i></p>
                            <p>${total_view?total_view:0 }</p>
                        </div>
                        <div>
                            <a class="btn btn-outline-info fs-3 text-dark" onclick="loadDetails('${news._id}')" data-bs-toggle="modal"
                            data-bs-target="#exampleModalScrollable"><i class="fa-solid fa-arrow-right-long"></i></a>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        `;
        newsContainer.appendChild(newsDiv);
    })


    // Update category Count
    // let categoryName;

    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => findCategoryName(data.data.news_category, category))
        .catch(error => console.log(error))

    const findCategoryName = (allCategories, categoryId) => {
        allCategories.forEach(c => {
            if(c.category_id === categoryId){
                if(count === 0){
                    newsCount.innerText = `No news found for category ${c.category_name}`;
                } else{
                    newsCount.innerText = `${count} item found for category ${c.category_name}`;
                }
            }
        })
    }

    // Hide Spinner/end spinner
   spinnerSection.classList.add('d-none');
    
}

// Load News Details by id
const loadDetails = newsId => {
    const url = `https://openapi.programming-hero.com/api/news/${newsId}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayDetails(data.data[0]))
        .catch(error => console.log(error))
}

// modal details show
const displayDetails = news => {
    
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">${news.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <h3>Author: ${news.author.name ? news.author.name : "Unknown Author"}</h3>
        <p><small>Date: ${news.author.published_date ? news.author.published_date : "No date found"}</small></p>
        <p><small>Total Views: ${news.total_view ? news.total_view : "0"}</small></p>
        <img class="img-fluid" src="${news.image_url}">
        <p class="mt-3">${news.details.length > 150 ? news.details.slice(0, 150)+'...' : news.details}</p>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
    `;
}
loadNews('02');