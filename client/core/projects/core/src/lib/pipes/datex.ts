import { Pipe, PipeTransform } from '@angular/core';
import { format as formatDate, isValid } from 'date-fns';
import de from 'date-fns/esm/locale/de';
@Pipe({
    name: 'datex'
})

export class DatexPipe implements PipeTransform {
    transform(value: Date, format: string = ''): string {
        if (!value || !isValid(value)) { return ''; }
        return formatDate(value, format, { locale: de });
    }
}
