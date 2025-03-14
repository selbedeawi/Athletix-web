import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value; 
    const timeParts = value.split(':');
    if (timeParts.length !== 3) return value;
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${formattedHours}:${minutes} ${period}`;
  }
}
