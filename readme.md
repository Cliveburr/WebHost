
// Create the package.json
npm init -y


// Instal typings to control type definition of typescript
// https://github.com/typings/typings
npm install typings --global
// Install the node.js typings
typings install dt~node --global


// Create a link for one package
// run over the dependencie package
npm link
// run over the main project
npm link <package-name> 



// How to create a typescript strongly type npm package
https://medium.com/@mweststrate/how-to-create-strongly-typed-npm-modules-1e1bda23a7f4#.6v3bcoa8o
=== package.json ===
{
    "name": "pets",
    "main": "lib/index.ts",
    "typings": "lib/index",
    "files": [
        "lib/"
    ]
    // etc
}

=== tsconfig.json ===
{
    "version": "1.6.2",
    "compilerOptions": {
        "module": "commonjs",
        "declaration": true,
        "outDir": "lib/"
    },
    "files": [
        "./src/index.ts"
    ]
}