import { Plugin, PluginBuild } from 'esbuild';
import sass from 'sass';
import path from 'path';

const sassPlugin = (): Plugin => ({
    name: 'sass',
    setup(build: PluginBuild) {
        build.onResolve({ filter: /\.scss$/ }, args => ({
            path: path.resolve(args.resolveDir, args.path),
            namespace: 'sass'
        }));
        build.onLoad({ filter: /.*/, namespace: 'sass' }, args => {
            // renderSync is significantly faster than render
            const compiled: sass.CompileResult = sass.compile(args.path);

            // const compiled: sass.Result = sass.renderSync({ file: args.path });
            console.log('compilerd css', args.path, compiled.css.toString())
            return {
                contents: compiled.css.toString(),
                loader: 'css'
            };
        });
    }
});

export { sassPlugin }
