# react three fiber portfolio

A React based 3D portfolio to showcase my past and future projects. The first public build you're able to see on yann.works was made in a week as a challenge. 

It's still has some rough edges and unpolished features, but the overall experience is already pretty good.

## screenshot

[![image-hero](./public/image-hero.png)](https://yann.works)
## features

 - **Performance scaling** for optimal experience across devices *(mobile, tablet, desktop)*
 - **Camera tuned** for device orientation
 - **Dynamic Camera positioning and targeting** using object bounds

### technologies & tools used

Most of the Three.js interaction was done through React Three Fiber. This made the process a whole lot faster than it would've taken otherwise. Some legacy Three.js code is still present for tuning UV wrapping around some meshes.

3D scene was made in blender, then exported to a .gltf, then sized down to a .jsx component using [gltfjsx](https://github.com/pmndrs/gltfjsx).

## getting started

To run this project locally, follow these steps:

 - Clone the repository
 - Install dependencies using `npm install --legacy-peer-deps`
 - Start the development server using `npm start`

## credits

3D Models were sourced from Sketchfab under CC licensing.

- [Old Computers by Rafael Rodrigues](https://sketchfab.com/3d-models/old-computers-7bb6e720499a467b8e0427451d180063)
- [Folding Table by Ahmed Kchikich](https://sketchfab.com/3d-models/folding-table-dba1b4270fee431290c464742f5fd4f5)
- [Wall 08 by Forest Run Forever](https://sketchfab.com/3d-models/wall-08-cd8d4cb8c1044b2eab9bbd7e7b77b257)


Inspiration from the Monitors r3f demo from [Paul Henschel](https://codesandbox.io/u/drcmda)
