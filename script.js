document.addEventListener('DOMContentLoaded', () => {

    // --- وظائف مشتركة لكل الصفحات ---

    // 1. تبديل الثيم (Dark/Light Mode)
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('light-mode');
            themeToggle.textContent = '🌙';
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // 2. قائمة الهامبرغر
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-menu'); // استخدم كلاس جديد لتجنب التعارض
    });

    // --- منطق خاص بالصفحة الرئيسية (index.html) ---
    if (document.getElementById('articles-grid')) {
        const articlesGrid = document.getElementById('articles-grid');
        const searchInput = document.getElementById('searchInput');
        const brandFilter = document.getElementById('brandFilter');
        const noResults = document.getElementById('no-results');
        let allArticles = []; // لتخزين جميع المقالات

        // جلب المقالات من RSS (استخدام RSS2JSON كمثال)
        const fetchArticles = async () => {
            // استبدل هذا الرابط برابط الـ RSS الذي تريده
            const rssUrl = 'https://www.theverge.com/rss/index.xml';
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
            
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (data.status === 'ok') {
                    allArticles = data.items;
                    displayArticles(allArticles);
                    populateBrandFilter(allArticles);
                }
            } catch (error) {
                articlesGrid.innerHTML = '<p>حدث خطأ في جلب المقالات.</p>';
                console.error('Error fetching articles:', error);
            }
        };

        // عرض المقالات في الصفحة
        const displayArticles = (articles) => {
            articlesGrid.innerHTML = '';
            if (articles.length === 0) {
                noResults.style.display = 'block';
                return;
            }
            noResults.style.display = 'none';

            articles.forEach(article => {
                const articleCard = document.createElement('article');
                articleCard.className = 'article-card fade-in visible';
                // استخراج اسم العلامة التجارية من العنوان (كمثال)
                const brand = article.title.split(' ')[0].toLowerCase();
                articleCard.setAttribute('data-brand', brand);
                articleCard.setAttribute('data-title', article.title.toLowerCase());
                
                articleCard.innerHTML = `
                    <div class="article-image" style="background-image: url('${article.thumbnail}'); background-size: cover;"></div>
                    <h3><a href="${article.link}" target="_blank">${article.title}</a></h3>
                    <p>${new Date(article.pubDate).toLocaleDateString()}</p>
                `;
                articlesGrid.appendChild(articleCard);
            });
        };

        // تعبئة فلتر العلامات التجارية
        const populateBrandFilter = (articles) => {
            const brands = new Set();
            articles.forEach(article => {
                // محاولة بسيطة لاستخراج اسم العلامة التجارية
                const potentialBrand = article.title.split(' ')[0];
                if (potentialBrand.length < 10) { // لتجنب الكلمات الطويلة
                   brands.add(potentialBrand);
                }
            });

            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.toLowerCase();
                option.textContent = brand;
                brandFilter.appendChild(option);
            });
        };

        // وظيفة البحث والفلترة
        const filterAndSearch = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedBrand = brandFilter.value;
            
            const filteredArticles = allArticles.filter(article => {
                const titleMatch = article.title.toLowerCase().includes(searchTerm);
                const brandMatch = (selectedBrand === 'all') || (article.title.toLowerCase().startsWith(selectedBrand));
                return titleMatch && brandMatch;
            });

            displayArticles(filteredArticles);
        };

        searchInput.addEventListener('input', filterAndSearch);
        brandFilter.addEventListener('change', filterAndSearch);

        // بدء العملية
        fetchArticles();
    }
});
