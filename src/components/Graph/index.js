import React from 'react';
import styled from 'styled-components';
import { Sparklines, SparklinesCurve, SparklinesSpots } from 'react-sparklines';

const GraphWrapper = styled.div`
	position: absolute;
	top: 60px;
	left: 10px;
	width: 200px;
	height: 50px;
`;

function Graph({ data }) {
	return (
		<GraphWrapper>
			<Sparklines
				data={data}
				min={0}
				max={100}
				width={200}
				height={50}
				margin={3}
			>
				<SparklinesCurve color="white" style={{ strokeWidth: 2 }} />
				<SparklinesSpots
					size={3}
					spotColors={{
						'-1': '#ff4848',
						'0': 'white',
						'1': '#48ff55',
					}}
				/>
			</Sparklines>
		</GraphWrapper>
	);
}

export default Graph;
