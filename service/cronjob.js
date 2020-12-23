const fs = require('fs');
const readline = require('readline');
const path = require('path');
const client = require('../service/redisDB');

const rootPath = path.dirname(require.main.filename || process.mainModule.filename);

const readInterface = path =>readline.createInterface({
    input: fs.createReadStream(path),
    console: false
});

const biltz = () =>{
    const lineStream = readInterface(`${rootPath}/public/BLITZ.txt`);
    lineStream.on('line', line =>{
        let trimmed = line.trim().replace(/\s/g,'');
        if(trimmed){
            let license = trimmed.slice(0, -1);
            let alertType = trimmed.slice(-1);
            console.log(`${license}: ${alertType}`);
            client.hmset('alert', license, JSON.stringify({alertType:alertType}));
        }
    })
        .on('close', () =>{
            client.save();
        });

};

const color = () =>{
    const lineStream = readInterface(`${rootPath}/public/Cor.txt`);
    lineStream.on('line', line =>{
        let trimmed = line.trim();
        let colorNumber = trimmed.substring(0, 2);
        let colorName = trimmed.substring(2);
        client.hmset('color', colorNumber, colorName);
    })
        .on('close', () =>{
            client.save();
        });
};

const type = () =>{
    const lineStream = readInterface(`${rootPath}/public/Tipo.txt`);
    lineStream.on('line', line =>{
        let trimmed = line.trim();
        let typeNumber = trimmed.substring(0, 2);
        let typeName = trimmed.substring(2);
        client.hmset('type', typeNumber, typeName);
    })
        .on('close', () =>{
            client.save();
        });
};

const brand = () =>{
    const lineStream = readInterface(`${rootPath}/public/Marcas.txt`);
    lineStream.on('line', line =>{
        let trimmed = line.trim();
        let brandNumber = trimmed.substring(0, 6);
        let brandName = trimmed.substring(6);
        client.hmset('brand', brandNumber, brandName);
    })
        .on('close', () =>{
           client.save();
        });
};

const place = () =>{
    const lineStream = readInterface(`${rootPath}/public/Municipio.txt`);
    lineStream.on('line', line =>{
        let trimmed = line.trim();
        if (trimmed) {
            trimmed = trimmed.replace(/\s\s+/g, ' ');
            let placeNumber = trimmed.substring(0, 4);
            let placeName = trimmed.substring(4);
            client.hmset('place', placeNumber, placeName);
        }
    })
        .on('close', () =>{
            client.save();
        });
};

const renavam = () =>{
    const lineStream = readInterface(`${rootPath}/public/RenavamSeparador.txt`);
    lineStream.on('line', line =>{
        let trimmed = line.trim().replace(/\s/g,'');
        let subStrings = trimmed.split('#');
        let license = subStrings[0];
        let state = subStrings[6].slice(1);
        let renavamId = subStrings[7];
        let cpf = subStrings[10].slice(3);
        let makeYear = subStrings[8];
        let modelYear = subStrings[9];
        let color = subStrings[2];
        let makeAndModel = subStrings[1];
        let owner = subStrings[11];
        client.hmset('renavam', license, JSON.stringify({
            state: state,
            renavamId: renavamId,
            cdf:cpf,
            makeYear: makeYear,
            modelYear: modelYear,
            color: color,
            makeAndModel: makeAndModel,
            owner: owner
        }))
    })
        .on('close', () =>{
            client.save();
        });
};

module.exports = {
    updateBlitz: biltz,
    updateColor: color,
    updateType: type,
    updateBrand: brand,
    updatePlace: place,
    updateRenavam: renavam
};