import { useState } from 'react';
import { Checkbox, Typography } from 'antd';
import MapGL, { Layer, Source } from 'react-map-gl';

import styles from '../styles/Legend.module.css';

const Component = () => {
  const [date, setDate] = useState('2017-18');
  const [type, setType] = useState('MEDIAN');

  const data = '/SA2_PERSONAL_INCOME.json';

  const stops = [
    [30000, '#f7fbff'],
    [40000, '#c8dcf0'],
    [50000, '#73b2d8'],
    [60000, '#2979b9'],
    [100000, '#08306b'],
  ];

  const dataLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-color': {
        property: `${type}_${date}`,
        stops,
        default: '#f7fbff',
      },
      'fill-opacity': 0.75,
    },
  };

  const [viewport, setViewport] = useState({
    latitude: -28.4,
    longitude: 134,
    zoom: 3.95,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, textAlign: 'center', paddingTop: 16 }}>
        <Typography.Title>Personal Income in Australia</Typography.Title>
        <Typography.Paragraph>
          Personal income from all sources. Data from the ABS.
        </Typography.Paragraph>
      </div>
      <div style={{ flex: 12 }}>
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          onViewportChange={(viewport) => setViewport(viewport)}
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <Source type="geojson" data={data}>
            {/*
              // @ts-ignore */}
            <Layer {...dataLayer} />
          </Source>

          <Legend
            stops={stops}
            date={date}
            setDate={setDate}
            type={type}
            setType={setType}
          />
        </MapGL>
      </div>
    </div>
  );
};

const Legend = ({ stops, date, setDate, type, setType }) => {
  const dates = [
    '2017-18',
    '2016-17',
    '2015-16',
    '2014-15',
    '2013-14',
    '2012-13',
    '2011-12',
  ];
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Typography.Title level={5}>Income $</Typography.Title>
        {stops.map((stop, i) => {
          const [end, color] = stop;
          const [start] = stops[i - 1] || [0];

          return (
            <div className={styles.legend}>
              <div
                className={styles.circle}
                style={{ backgroundColor: color }}
              />
              <Typography.Text
                className={styles.text}
              >{`${start} - ${end}`}</Typography.Text>
            </div>
          );
        })}
      </div>

      <div className={styles.card}>
        <Typography.Title level={5}>Date</Typography.Title>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {dates.map((item) => (
            <div>
              <Checkbox
                key={item}
                checked={date === item}
                value={item}
                onChange={(checkedValues) =>
                  setDate(checkedValues.target.value)
                }
              >
                {item}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <Typography.Title level={5} style={{ paddingTop: 16 }}>
          Type
        </Typography.Title>
        <Checkbox
          checked={type === 'MEDIAN'}
          value="MEDIAN"
          onChange={(checkedValues) => setType(checkedValues.target.value)}
        >
          Median
        </Checkbox>
        <Checkbox
          checked={type === 'MEAN'}
          value="MEAN"
          onChange={(checkedValues) => setType(checkedValues.target.value)}
        >
          Mean
        </Checkbox>
      </div>
    </div>
  );
};

export default Component;
