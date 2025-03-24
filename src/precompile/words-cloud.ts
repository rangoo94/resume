import { createCanvas } from "canvas";
import cloud from "d3-cloud";

type Word = Required<cloud.Word> & { width: number; height: number; className?: string };

// const orientations = [ 0, 45 ];
const orientations = [ 0 ];
const width = 1400;
const height = 250;

export async function buildTechnologyWordsCloud() {
    const technologies = require('../../config/technologies.json');
    const data: Word[] = await new Promise(resolve => {
        cloud()
            .canvas(() => createCanvas(1, 1) as any)
            .size([width, height])
            .words(technologies.map((x: any) => ({
                text: x.name,
                className: x.type.join(' '),
                size: x.weight || 1,
            })))
            .padding(3)
            .rotate((_, index: number) => orientations[index % orientations.length])
            .fontSize(d => Math.sqrt(d.size! * 130))
            .fontWeight(400)
            .font("Red Hat Display")
            .spiral("rectangular")
            .random(() => 0.7)
            .on("end", resolve)
            .start()
    });

    const minX = Math.min(...data.map(d => d.x - (d.width/2)));
    const maxX = Math.max(...data.map(d => d.x + (d.width/2)));
    const minY = Math.min(...data.map(d => d.y - (d.height/2)));
    const maxY = Math.max(...data.map(d => d.y + (d.height/2)));
    const scaleX = (maxX - minX) / width;
    const scaleY = (maxY - minY) / height;
    const scale = 1 / Math.max(scaleX, scaleY);
    const translateX = Math.abs(minX) * scale + Math.abs(minX) * (1/scaleX - scale) /3;
    const translateY = Math.abs(minY) * scale + Math.abs(minY) * (1/scaleY - scale) /3;

    return `
      <svg viewBox="0 0 ${width} ${height}">
        <g transform="translate(${translateX},${translateY})">
            ${data.map(d => `
              <text class="${d.className}" style="font-size: ${d.size * scale}" transform="translate(${d.x * scale}, ${d.y * scale}) rotate(${d.rotate})">${d.text}</text>
            `).join('')}
        </g>
      </svg>
    `
}
