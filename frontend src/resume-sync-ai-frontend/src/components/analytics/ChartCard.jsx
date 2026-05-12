import React from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const ChartCard = ({ title, data, options }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <Line data={data} options={options} />
    </div>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
};

ChartCard.defaultProps = {
  options: {},
};

export default ChartCard;