
const books = [
    { id: '1coMBAQVvprzZcmYpIZX-VGlFNyeHu99Q', title: "Africa God's Generals - The Soul - Eddie Sempala", category: 'growth' },
    { id: '1wczJCOfhFfw4_W_am--MgTT2w3FqHDji', title: "Disciplines of a Godly Man - R.Kent Hughes", category: 'growth' },
    { id: '1ql3YkFCMPItNkMi_JsYDRjpY9fht70uQ', title: "Humility - C. Peter Wagner", category: 'growth' },
    { id: '1SPDwV3Yy8UgMdnDfWeBZAzqf5KxPy4s2', title: "Joshua Living as a Consistent - Gene Getz", category: 'growth' },
    { id: '1k-5Ts2Wz2om9iML2Zhr3HETAEMnvJcJJ', title: "Preparing for Marriage - John Piper", category: 'parenting' },
    { id: '1eKh_5gbuOVsy4pmFePWKYCS_7zNK4rSi', title: "Smith Wigglesworth Ever increasing Faith (2)", category: 'faith' },
    { id: '1ZBa_v3vRO2rDGkQO-ksCt3uvIZKOQSOy', title: "Spiritual Warfare for Every Christian - Dean Sherman", category: 'prayer' },
    { id: '18U-vwAEWZzYRM51Y0MLXud-K-GIfjVa1', title: "Youth Ministry Nuts and Bolts", category: 'ministry' },
    { id: '1n4k9jV-NmbhnlG1sPwnhEWTiQ0JHfEkO', title: "Why Revival Tarries - Leonard Ravenhill", category: 'prayer' },
    { id: '1nmZJs4i2P31i48ff8MDMNq4A0vr_rR8R', title: "Understanding Todays Youth Culture - Walt Mueller", category: 'ministry' },
    { id: '1PJRTz5ZcjKV4n66Sa-L69RrM21w37vRP', title: "The Holy Spirit and His gifts - Kenneth E Hagin", category: 'faith' },
    { id: '1U2BAQhOgDMHCyJC0EpvBir9-tkempBlh', title: "The Consistent Christian - William Secker", category: 'growth' }
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
    const filename = `${book.title}.pdf`;
    const filepath = path.join(dir, filename);
    const url = `https://drive.google.com/uc?export=download&id=${book.id}`;

    console.log(`Downloading ${book.title} to ${filepath}...`);
    try {
        // Use -L for redirects and -s for silent
        execSync(`curl.exe -L "${url}" -o "${filepath}"`);
        console.log(`Success.`);
    } catch (e) {
        console.error(`Failed to download ${book.title}: ${e.message}`);
    }
});
