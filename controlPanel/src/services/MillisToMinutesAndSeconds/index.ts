import { Timer } from '../../types/Bot';

export const millisToMinutesAndSeconds = (millis: number): Timer => {
    if (!millis || millis < 0)
        return {
            minutes: 0,
            seconds: 0,
        };
    let minutes = Math.floor(millis / 60000);
    let seconds = Number(((millis % 60000) / 1000).toFixed(0));
    if (seconds === 60) {
        minutes = minutes + 1;
        seconds = 0;
    }
    return { minutes, seconds };
};
