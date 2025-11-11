import sharp from "sharp";
import path from "node:path";
import { readdir } from 'node:fs/promises';
const publicPath = path.resolve("public");
const imgPath = path.resolve("public/img");

async function optimizeImage(fileName){
    const base = fileName.split(".")[0];
    const inputPath = path.resolve(publicPath,fileName);
    const outputPath = path.resolve(imgPath,`${base}.webp`);

    
    await sharp(inputPath).webp({ quality: 70 }).toFile(outputPath);
}


async function grabAllPngs(){
    const files = await readdir(publicPath);
    const pngFiles = files.filter(file => path.extname(file)===".png");
    return pngFiles;
}

async function optimizeAllPngs(){
    const pngFiles = await grabAllPngs();
    for(const pngFile of pngFiles){
        await optimizeImage(pngFile);
    }
}
export{optimizeAllPngs};