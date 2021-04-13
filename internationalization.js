const IE_DEFAULT = 'en-US';//Solo para Internet EXPlorer
const translate = (locale) => sessionStorage.setItem('lang', locale);

const updateLng = () => {
    document.querySelectorAll('[data-row]').forEach(element => {
        const PATH = `./locale/${sessionStorage.getItem('lang') ?? (navigator.language || IE_DEFAULT)}.js`;
        const i18n = import(PATH);
        const EXP = /\b(.*[^:]):(.*)\b/;
        let currentMatch;
        
        i18n.then(({ i18n }) => {
            currentMatch = i18n;
            element.dataset.row.split('.').forEach(value => { if (value in currentMatch) currentMatch = currentMatch[value]; });
            element.dataset.param &&
                element.dataset.param.split(',').forEach(param => {
                    const [_, key, value] = EXP.exec(param);
                    currentMatch = currentMatch.includes(`{${key}}`) ? String(currentMatch).replace(`{${key}}`, value) : currentMatch;

                });
            element.innerHTML = currentMatch;

        })
            .catch(r => console.error(r));
    })

}

window.onload = () => {
    updateLng();
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', setLNG);
        function setLNG() {
            translate(btn.dataset.lang);
            updateLng();
        }
    });

};








