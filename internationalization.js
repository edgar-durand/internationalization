const IE_DEFAULT = 'en-US';//Solo para Internet EXPlorer

/**
 * 
 * @param {string} element 
 */
const _ErrorLogs = (element, params) => {
    const PATH = `./locale/${sessionStorage.getItem('lang') ?? (navigator.language || IE_DEFAULT)}.js`;
    const i18n = import(PATH);
    const EXP = /\b(.*[^:]):(.*)\b/;
    var currentMatch;
    i18n.then(({ i18n }) => {
        currentMatch = i18n;

        element.split('.').forEach(value => { if (value in currentMatch) currentMatch = currentMatch[value]; });
        params &&
            params.split(',').forEach(param => {
                const [_, key, value] = EXP.exec(param);
                currentMatch = currentMatch.includes(`{${key}}`) ? currentMatch.replace(`{${key}}`, value) : currentMatch;

            });
            throw new Error(currentMatch);

    })
        .catch((err) => console.error(err));
        
};

const translate = async (locale) => await import(`./locale/${locale}.js`)
    .then(() => sessionStorage.setItem('lang', locale))
    .catch(() => _ErrorLogs('lngErr', `lng:${locale}`));

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
    })

}

window.onload = () => {
    updateLng();
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', setLNG);
        function setLNG() {
            translate(btn.dataset.lang).then(() => updateLng());
        }
    });

};








