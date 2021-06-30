const http = require('http');
const querystring = require('querystring');

function generateCircle(params) {
    let svg = `
        <svg 
            xmlns="http://www.w3.org/2000/svg" version="1.1"
        >   
            <rect rx="10" ry="10" width="${params.width}" height="${params.height}" style="background: #1a1b27;"></rect>
            <text x="100" y="75" stroke="${params.color}" fill="none" stroke-width=".5" text-anchor="middle">${params.name}</text>
            <path d="M 100 25 a 50 50 0 0 1 0 100 a 50 50 0 0 1 0 -100 Z" fill="none" stroke="#ccc" stroke-width="5"></path>
            <path d="M 100 25 a 50 50 0 0 1 0 100 a 50 50 0 0 1 0 -100 Z" fill="none" stroke="${params.color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="314.1592653589793">
                <animate attributeName="stroke-dashoffset" from="314.1592653589793" to="0" dur="3s" repeatCount="1" />
            </path>
        </svg>
    `;
    return svg
}

function generateText(params) {
    /**
     * svg path A参数说明
     * A rx ry x-axis-rotation large-arc-flag sweep-flag x y
     * rx: x轴半径
     * ry: y轴半径
     * x-axis-rotation: 指椭圆的X轴与水平方向顺时针方向夹角，可以想象成一个水平的椭圆绕中心点顺时针旋转的角度
     * large-arc-flag: 1表示大角度弧线，0为小角度弧线
     * sweep-flag: 1为顺时针方向，0位逆时针方向
     * x: 结束点x坐标
     * y: 结束点y坐标
     */
    const svg = `<svg width="${params.width}" height="${params.height}" viewBox="0 0 ${params.width} ${params.height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <path id="textCircle" d="M 20 100 A 80 80 0 0 1 180 100 A 80 80 0 0 1 20 100" fill="none" stroke="#333"></path>
        </defs>
        <text class="textCircle" fill="${params.color}" style="font-size: ${params.size}px; letter-spacing: 4px;">
            <textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#textCircle">${params.text}</textPath>
        </text>
    </svg>`
    return svg;
}


function generateSvg(params) {
    const obj = {
        name: 'btea',
        color: '#6cf',
        type: 'image',
        width: 200,
        height: 150
    }
    params = Object.assign(obj, params);
    let img, type = params.type;
    if (type === 'image') {
        img = generateCircle(params);
    }
    if (type === 'text') {
        img = generateText(params);
    }
    return img;
}

http.createServer((req, res) => {
    let { url } = req;
    let params = url.split('?');
    let val = params[0];
    if (/image$/.test(val)) {
        res.setHeader('Cache-Control', ['no-cache', 'must-revalidate']);
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
        params = querystring.parse(params[1] || '');
        let image = generateSvg(params);
        res.end(image);
        return;
    }
    res.end('');
}).listen(3322);
