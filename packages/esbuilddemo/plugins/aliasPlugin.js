
module.exports = options => {
  const aliases = Object.keys(options);
  const re = new RegExp(`^(${aliases.map(x => escapeRegExp(x)).join('|')})$`);
  console.log('aliases', aliases, re);
  return {
    name: 'aliases',
    setup(build) {
      build.onResolve({ filter: re}, args => ({
        path: options[args.path]
      }))
    }
  }
}

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}