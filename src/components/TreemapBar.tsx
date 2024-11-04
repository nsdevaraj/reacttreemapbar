import React from 'react';
import * as d3 from 'd3';

interface TreemapBarProps {
  data: {
    value: number;
    subvalues: number[];
    category: string;
  };
  width: number;
  height: number;
  colorScale: d3.ScaleSequential<string>;
  xOffset: number;
}

const TreemapBar: React.FC<TreemapBarProps> = ({ data, width, height, colorScale, xOffset }) => {
  const totalValue = data.value;
  
  return (
    <g transform={`translate(${xOffset},0)`}>
      {data.subvalues.map((subvalue, i) => {
        const subHeight = (subvalue / totalValue) * height;
        const yOffset = height - (data.subvalues
          .slice(0, i + 1)
          .reduce((sum, val) => sum + (val / totalValue) * height, 0));

        return (
          <g key={i} transform={`translate(0,${yOffset})`}>
            <rect
              width={width}
              height={subHeight}
              fill={colorScale(i)}
              opacity={0.9}
              onMouseOver={(event) => {
                const target = event.currentTarget;
                target.style.opacity = '1';
                target.style.stroke = '#000';
                target.style.strokeWidth = '1';

                const tooltip = d3.select('body')
                  .append('div')
                  .attr('class', 'tooltip')
                  .style('position', 'absolute')
                  .style('background', 'white')
                  .style('padding', '8px')
                  .style('border', '1px solid #ddd')
                  .style('border-radius', '4px')
                  .style('pointer-events', 'none')
                  .style('opacity', '0');

                tooltip.transition()
                  .duration(200)
                  .style('opacity', '0.9');

                tooltip.html(`Value: ${subvalue}`)
                  .style('left', `${event.pageX + 10}px`)
                  .style('top', `${event.pageY - 28}px`);
              }}
              onMouseOut={(event) => {
                const target = event.currentTarget;
                target.style.opacity = '0.9';
                target.style.stroke = 'none';
                d3.selectAll('.tooltip').remove();
              }}
            />
            {subvalue / totalValue > 0.2 && (
              <text
                x={width / 2}
                y={subHeight / 2}
                dy="0.35em"
                textAnchor="middle"
                fill="white"
                fontSize="12px"
                fontWeight="bold"
              >
                {subvalue}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default TreemapBar;