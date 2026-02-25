
const books = [
    { id: '1fhfmdfjzgaLWtBgLoF_jPDTLPuotW-kw', title: "Passion And Purity - Elisabeth Elliot", category: 'growth' },
    { id: '1RdkQ62RH5j53G5p11aTF7IjVzmRWLcZH', title: "Power of Letting Go - Rev. J Martin", category: 'growth' },
    { id: '1CiLgl3b4rqp6Yr-KKlpCPg7zblDy6vZY', title: "Living the spiritually balanced life - Ray Sherman Anderson", category: 'growth' },
    { id: '1_usz4t64RQZpCWEsoOUyGY1fjGCorsVC', title: "Where Wisdom Begins - Derek Prince", category: 'growth' },
    { id: '1Lop5nPdCV_yUaMUfu04TW-3n4Fmt0buw', title: "The Reality Of Prayer - E. M. Bounds", category: 'prayer' },
    { id: '1iGFYO0qaqxyTwEhl5ISUn5YrZZKcQKi5', title: "A Young Woman After Gods Own Heart - Elizabeth George", category: 'parenting' },
    { id: '1OuxS1ne3Zjn2weZSBkNlPV_wdyATnBpt', title: "An Unhurried Life - Alan Fadling", category: 'growth' },
    { id: '1qJWa5cPkxDUAe0ZeqsCeQcjtXt4AiDk1', title: "Biblical Keys to Financial Pros - Kenneth E. Hagin", category: 'growth' },
    { id: '1zRpiasPr_2d2qvfSnBESfudcaHQFA-MC', title: "Born Again Again - Ross Lanphere", category: 'growth' },
    { id: '19EYJpvnRA1SWjny_ltfYyfpPB5zAYNX4', title: "Freedom From Debt - Daniel Kolenda", category: 'growth' },
    { id: '17UYM1ABy3UnLc_AIqT_qBv2jp_O1Kmer', title: "Purpose Driven Youth Ministry Training Kit - Dung Fields", category: 'ministry' },
    { id: '1DPRlFEUgQeBKBkb4Al-nhjTP6sfpj5Gz', title: "Secret Power - D. L. Moody", category: 'prayer' },
    { id: '1OlQ-UPhUPPbIPHFUslmnkpakgBitGhzS', title: "Servant Leadership - Efrain Agosto", category: 'leadership' },
    { id: '1WT4MePbND9vCNv9jCCC6Ur1jGxhTgS7S', title: "Surrounded by Idiots - Thomas Erikson", category: 'leadership' },
    { id: '1um-A5pw-tR3j2vNYY4na-u0jpvDqfpEf', title: "The 21 Indispensable Qualities of a Leader - John C Maxwell", category: 'leadership' },
    { id: '1VaFnw43ovjqJGwijuO92ekdKhQ0DNDU8', title: "Wisdom is the Principal Thing for Your Ministry - Dag Heward-Mills", category: 'ministry' }
];

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const baseDir = 'public/pdfs';

books.forEach(book => {
    const dir = path.join(baseDir, book.category);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // Clean filename
    const filename = `${book.title.replace(/[\\/:*?"<>|]/g, '')}.pdf`;
    const filepath = path.join(dir, filename);
    const url = `https://drive.google.com/uc?export=download&id=${book.id}`;

    console.log(`Downloading ${book.title} to ${filepath}...`);
    try {
        execSync(`curl.exe -L "${url}" -o "${filepath}"`);
        console.log(`Success.`);
    } catch (e) {
        console.error(`Failed to download ${book.title}: ${e.message}`);
    }
});
