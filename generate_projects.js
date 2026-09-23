const fs = require('fs');

const content = fs.readFileSync('bfc-consulting-innovation/pages/OurProjectsPage.tsx', 'utf-8');
const match = content.match(/export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);/);

if (match) {
    try {
        let arrayStr = match[1];
        // simple eval to get the object, we just need to mock the image variables
        const logoADPME = 'logoADPME';
        const logoSONAPI = 'logoSONAPI';
        const logoOfficeRoyale = 'logoOfficeRoyale';
        const logoExpertiseFrance = 'logoExpertiseFrance';
        const logoAPIP = 'logoAPIP';
        const logoAMRTP = 'logoAMRTP';
        const logoCILSS = 'logoCILSS';
        const logoEuropeanBank = 'logoEuropeanBank';
        const logoAMFUMOA = 'logoAMFUMOA';
        const logoCAMPOST = 'logoCAMPOST';
        const logoSOGUIPAH = 'logoSOGUIPAH';
        const logoConnectInnov = 'logoConnectInnov';
        const logoSelect = 'logoSelect';
        const logoLaPosteBenin = 'logoLaPosteBenin';
        const logoMinNumerique = 'logoMinNumerique';
        const logoAMICommerciale = 'logoAMICommerciale';
        const logoWikiStartup = 'logoWikiStartup';
        const logoAZIZA = 'logoAZIZA';
        const logoMunathara = 'logoMunathara';
        const logoMinFinance = 'logoMinFinance';
        const logoNGTech = 'logoNGTech';
        const logoOIT = 'logoOIT';
        const logoSOTUGAR = 'logoSOTUGAR';
        const logoKALYS = 'logoKALYS';
        const logoUGFS = 'logoUGFS';
        const logoSOROUBAT = 'logoSOROUBAT';
        const logoTUNEPS = 'logoTUNEPS';
        const logoSOLIDAR = 'logoSOLIDAR';
        const logoNGOBeninAction = 'logoNGOBeninAction';
        const logoRoseBlanche = 'logoRoseBlanche';
        const logoRedGO = 'logoRedGO';
        const logoVILAVI = 'logoVILAVI';
        const logoDjibouti = 'logoDjibouti';
        const logoWorldBank = 'logoWorldBank';
        const logoPDACG = 'logoPDACG';
        
        let obj = eval('(' + arrayStr + ')');
        
        let mapped = obj.map(p => ({
            title: p.title,
            category: p.category,
            client: p.client,
            country: p.country,
            flag: p.flag,
            year: p.year,
            startDate: p.startDate || '',
            endDate: p.endDate || '',
            description: p.description,
            accent: p.accent,
            imageUrl: p.imageUrl,
            contentJson: JSON.stringify({ isPublished: true, isSeeded: true })
        }));
        
        fs.writeFileSync('bfc-backend/bfc/src/main/resources/seed/projects.json', JSON.stringify(mapped, null, 2));
        console.log('Successfully wrote ' + mapped.length + ' projects to seed/projects.json');
    } catch(e) {
        console.error(e);
    }
} else {
    console.log("Could not find PROJECTS array.");
}
