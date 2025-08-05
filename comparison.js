document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('comparison-content')) {
        const tabsContainer = document.querySelector('.tabs');
        const device1Select = document.getElementById('device1-select');
        const device2Select = document.getElementById('device2-select');
        const compareBtn = document.getElementById('compare-btn');
        const resultsContainer = document.getElementById('comparison-results');
        
        // بيانات وهمية (يجب استبدالها بـ fetch من مصادر حقيقية)
        const mockData = {
            phones: [
                { id: 'iphone15pro', name: 'iPhone 15 Pro', specs: { 'المعالج': 'A17 Pro', 'الشاشة': '6.1"', 'الكاميرا': '48MP' } },
                { id: 's24ultra', name: 'Galaxy S24 Ultra', specs: { 'المعالج': 'Snapdragon 8 Gen 3', 'الشاشة': '6.8"', 'الكاميرا': '200MP' } }
            ],
            gpus: [
                { id: 'rtx4090', name: 'Nvidia RTX 4090', specs: { 'الذاكرة': '24GB GDDR6X', 'سرعة البوست': '2.52 GHz', 'استهلاك الطاقة': '450W' } },
                { id: 'rx7900xtx', name: 'AMD RX 7900 XTX', specs: { 'الذاكرة': '24GB GDDR6', 'سرعة البوست': '2.5 GHz', 'استهلاك الطاقة': '355W' } }
            ],
            cpus: [
                 { id: 'i9-14900k', name: 'Intel Core i9-14900K', specs: { 'الأنوية': '24', 'المسارات': '32', 'التردد': '6.0GHz' } },
                 { id: 'r9-7950x', name: 'AMD Ryzen 9 7950X', specs: { 'الأنوية': '16', 'المسارات': '32', 'التردد': '5.7GHz' } }
            ],
            laptops: [
                { id: 'macbookpro', name: 'MacBook Pro 14', specs: { 'المعالج': 'M3 Pro', 'الرام': '18GB', 'الشاشة': '14.2"' } },
                { id: 'delxps15', name: 'Dell XPS 15', specs: { 'المعالج': 'Core Ultra 7', 'الرام': '16GB', 'الشاشة': '15.6"' } }
            ]
        };
        
        let currentTab = 'phones';
        let currentData = [];

        // تعبئة القوائم المنسدلة
        const populateSelects = (data) => {
            device1Select.innerHTML = '';
            device2Select.innerHTML = '';
            currentData = data;

            data.forEach(device => {
                const option1 = new Option(device.name, device.id);
                const option2 = new Option(device.name, device.id);
                device1Select.add(option1);
                device2Select.add(option2);
            });
             if (data.length > 1) {
                device2Select.selectedIndex = 1;
            }
        };

        // تبديل التبويبات
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                currentTab = e.target.dataset.tab;
                
                // تحديث شكل التبويب النشط
                document.querySelector('.tab-button.active').classList.remove('active');
                e.target.classList.add('active');
                
                // جلب البيانات للتبويب الجديد
                // ملاحظة: هنا نستخدم البيانات الوهمية. في التطبيق الحقيقي، ستقوم بعمل fetch
                // fetch(`your_api_or_json_url_for_${currentTab}`).then(...)
                populateSelects(mockData[currentTab] || []);
                resultsContainer.innerHTML = ''; // إفراغ النتائج عند تغيير التبويب
            }
        });

        // زر المقارنة
        compareBtn.addEventListener('click', () => {
            const device1Id = device1Select.value;
            const device2Id = device2Select.value;
            
            if (device1Id === device2Id) {
                alert('الرجاء اختيار جهازين مختلفين للمقارنة.');
                return;
            }

            const device1Data = currentData.find(d => d.id === device1Id);
            const device2Data = currentData.find(d => d.id === device2Id);

            displayComparison(device1Data, device2Data);
        });
        
        // عرض بطاقات المقارنة
        const displayComparison = (dev1, dev2) => {
            resultsContainer.innerHTML = `
                <div class="device-card">
                    <h3>${dev1.name}</h3>
                    <ul>
                        ${Object.entries(dev1.specs).map(([key, value]) => `<li><strong>${key}</strong> <span>${value}</span></li>`).join('')}
                    </ul>
                </div>
                <div class="device-card">
                    <h3>${dev2.name}</h3>
                    <ul>
                        ${Object.entries(dev2.specs).map(([key, value]) => `<li><strong>${key}</strong> <span>${value}</span></li>`).join('')}
                    </ul>
                </div>
            `;
        };
        
        // بدء التشغيل لأول مرة
        populateSelects(mockData.phones);
    }
});
