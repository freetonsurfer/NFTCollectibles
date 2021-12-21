const { deployConfig } = require('../config/deploy_config.js')

var fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

async function some() {
    console.log("some")
}

(async () => {

     for (let l0=0; l0<deployConfig.levels[0].images.length; l0++) {

        for (let l1=0; l1<deployConfig.levels[1].images.length; l1++) {

            for (let l2=0; l2<deployConfig.levels[2].images.length; l2++) {

                for (let l3=0; l3<deployConfig.levels[3].images.length; l3++) {
                    const canvas = createCanvas(width, height)
                    const context = canvas.getContext('2d')
                    const image0 =  await loadImage(deployConfig.levels[0].images[l0].path)
                    context.drawImage(image0, 0, 0, image0.width, image0.height)
                    const image1 =  await loadImage(deployConfig.levels[1].images[l1].path)
                    context.drawImage(image1, 0, 0, image0.width, image0.height)
                    const image2 =  await loadImage(deployConfig.levels[2].images[l2].path)
                    context.drawImage(image2, 0, 0, image0.width, image0.height)
                    const image3 =  await loadImage(deployConfig.levels[3].images[l3].path)
                    context.drawImage(image3, 0, 0, image0.width, image0.height)
                    const buffer = canvas.toBuffer('image/png')
                    fs.writeFileSync(`./merge/out/${l0}${l1}${l2}${l3}.png`, buffer)
                }
            }
        }
    }

})()
