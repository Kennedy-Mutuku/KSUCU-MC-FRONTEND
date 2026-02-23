
const links = [
    '1fhfmdfjzgaLWtBgLoF_jPDTLPuotW-kw',
    '1RdkQ62RH5j53G5p11aTF7IjVzmRWLcZH',
    '1CiLgl3b4rqp6Yr-KKlpCPg7zblDy6vZY',
    '1_usz4t64RQZpCWEsoOUyGY1fjGCorsVC',
    '1Lop5nPdCV_yUaMUfu04TW-3n4Fmt0buw',
    '1iGFYO0qaqxyTwEhl5ISUn5YrZZKcQKi5',
    '1OuxS1ne3Zjn2weZSBkNlPV_wdyATnBpt',
    '1qJWa5cPkxDUAe0ZeqsCeQcjtXt4AiDk1',
    '1zRpiasPr_2d2qvfSnBESfudcaHQFA-MC',
    '19EYJpvnRA1SWjny_ltfYyfpPB5zAYNX4',
    '17UYM1ABy3UnLc_AIqT_qBv2jp_O1Kmer',
    '1DPRlFEUgQeBKBkb4Al-nhjTP6sfpj5Gz',
    '1OlQ-UPhUPPbIPHFUslmnkpakgBitGhzS',
    '1WT4MePbND9vCNv9jCCC6Ur1jGxhTgS7S',
    '1um-A5pw-tR3j2vNYY4na-u0jpvDqfpEf',
    '1VaFnw43ovjqJGwijuO92ekdKhQ0DNDU8'
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
