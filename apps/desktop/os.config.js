const OS = process.platform === 'win32' ? 'WIN' : 'MAC'

module.exports = {
    files: '**',
    from: new RegExp(`\/\/${OS}`, 'g'),
    to: `/*${OS}*/`
};