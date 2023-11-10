import React, { useState } from 'react';
import Slider from 'rc-slider';
import classes from './time-range-slider.module.scss';

const TimeRangeSlider = () => {
    const step = 10; // 10 minutes step
    const totalHours = 24; // 24 hours

    const [value, setValue] = useState([0, (totalHours * 60)]); // Default range from 00:00 to 23:59
    const [marks, setMarks] = useState<any>({ 0: '00:00', [(totalHours * 60)]: '24:00' });
    const formatTime = (minutes: any) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(mins).padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}`;
    };

    const handleChange = (newValue: any) => {
        console.log('start time: ', formatTime(value[0]), 'end time: ', formatTime(value[1]));
        setValue(newValue);
        const newMarks = {
            [newValue[0]]: formatTime(newValue[0]),
            [newValue[1]]: formatTime(newValue[1])
        };

        setMarks(newMarks);
    };

    return (
        <div className={classes.container}>
            <span>0</span>
            <Slider
                range
                min={0}
                max={(totalHours * 60)}
                value={value}
                step={step}
                onChange={handleChange}
                marks={marks}
            />
            <span>24</span>
        </div>
    );
};

export default TimeRangeSlider;
