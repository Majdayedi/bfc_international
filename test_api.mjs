const TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBiZmMuY29tIiwibmFtZSI6IkFkbWluIiwiaWQiOjEsImlhdCI6MTc4MTgyMzkxOSwiZXhwIjoxNzgxOTEwMzE5fQ.ADKihmfpsqmBm7TH4EIxvH2FEop36dz6nWGZnoBCU4Y52wXfWrpIl8URkvU1iS';

async function test() {
    try {
        const res = await fetch('http://localhost:8085/api/projects');
        console.log('Status (no auth):', res.status);
        const txt = await res.text();
        console.log('Length:', txt.length);
        if (txt.length > 0) {
            const data = JSON.parse(txt);
            console.log('Total projects:', data.length);
        }
    } catch(e) {
        console.log('Error:', e.message);
    }
}

test();
