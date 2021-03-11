import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'bytex'
})

export class BytexPipe implements PipeTransform {
    transform(value: number, format: 'SI' | 'IEC' | 'Both'): string {
        if (!value ) {value = 0; }
        if (format === 'Both') return this.transform(value, 'SI') + ' ' + this.transform(value, 'IEC');
        let sizes: { exponent: number, unit: string }[];
        if (format === 'SI') {
            sizes = [
                { exponent: Math.pow(1000, 0), unit: 'B' },
                { exponent: Math.pow(1000, 1), unit: 'KB' },
                { exponent: Math.pow(1000, 2), unit: 'MB' },
                { exponent: Math.pow(1000, 3), unit: 'GB' },
                { exponent: Math.pow(1000, 4), unit: 'TB' },
                { exponent: Math.pow(1000, 5), unit: 'PB' },
                { exponent: Infinity, unit: '?' }
            ];
        } else {
            sizes = [
                { exponent: Math.pow(1024, 0), unit: 'B' },
                { exponent: Math.pow(1024, 1), unit: 'KiB' },
                { exponent: Math.pow(1024, 2), unit: 'MiB' },
                { exponent: Math.pow(1024, 3), unit: 'GiB' },
                { exponent: Math.pow(1024, 4), unit: 'TiB' },
                { exponent: Math.pow(1024, 5), unit: 'PiB' },
                { exponent: Infinity, unit: '?' }
            ];
        }
        for (let i = 1; i < sizes.length; i++) {
            if (value < sizes[i].exponent) {
                return `${(value / sizes[i - 1].exponent).toFixed(1)} ${sizes[i - 1].unit}`;
            }
        }
        return '';
    }
}
