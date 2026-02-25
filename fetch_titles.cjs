
const links = [
    '1coMBAQVvprzZcmYpIZX-VGlFNyeHu99Q',
    '1wczJCOfhFfw4_W_am--MgTT2w3FqHDji',
    '1ql3YkFCMPItNkMi_JsYDRjpY9fht70uQ',
    '1SPDwV3Yy8UgMdnDfWeBZAzqf5KxPy4s2',
    '1k-5Ts2Wz2om9iML2Zhr3HETAEMnvJcJJ',
    '1eKh_5gbuOVsy4pmFePWKYCS_7zNK4rSi',
    '1ZBa_v3vRO2rDGkQO-ksCt3uvIZKOQSOy',
    '18U-vwAEWZzYRM51Y0MLXud-K-GIfjVa1',
    '1n4k9jV-NmbhnlG1sPwnhEWTiQ0JHfEkO',
    '1nmZJs4i2P31i48ff8MDMNq4A0vr_rR8R',
    '1PJRTz5ZcjKV4n66Sa-L69RrM21w37vRP',
    '1U2BAQhOgDMHCyJC0EpvBir9-tkempBlh'
];

const { execSync } = require('child_process');

links.forEach(id => {
    try {
        const url = `https://drive.google.com/file/d/${id}/view?usp=sharing`;
        const output = execSync(`curl.exe -L -s "${url}"`).toString();
        const titleMatch = output.match(/<title>(.*?)<\/title>/);
        if (titleMatch) {
            console.log(`${id}|${titleMatch[1]}`);
        } else {
            console.log(`${id}|NOT FOUND`);
        }
    } catch (e) {
        console.log(`${id}|ERROR: ${e.message}`);
    }
});
