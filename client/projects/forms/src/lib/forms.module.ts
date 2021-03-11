import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CheckboxElementComponent } from './components/fields/checkbox-element/checkbox-element.component';
import { FormComponent } from './components/form.component';
import { InputElementComponent } from './components/fields/input-element/input-element.component';
import { RadioGroupElementComponent } from './components/fields/radiogroup-element/radio-group-element.component';
import { SelectElementComponent } from './components/fields/select-element/select-element.component';
import { SlideElementComponent } from './components/fields/slide-element/slide-element.component';
import { SliderElementComponent } from './components/fields/slider-element/slider-element.component';
import { ArrayElementComponent } from './components/fields/array-element/array-element.component';
import { ButtonElementComponent } from './components/fields/button-element/button-element.component';
import { TextareaElementComponent } from './components/fields/textarea-element/textarea-element.component';



@NgModule({
    declarations: [
        CheckboxElementComponent,
        FormComponent,
        InputElementComponent,
        TextareaElementComponent,
        RadioGroupElementComponent,
        SelectElementComponent,
        SlideElementComponent,
        SliderElementComponent,
        ArrayElementComponent,
        ButtonElementComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSliderModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
    ],
    exports: [
        FormComponent,
    ],
})
export class AkronsFormsModule { }
