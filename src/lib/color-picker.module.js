import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextDirective, SliderDirective } from './helpers';
import { ColorPickerService } from './color-picker.service';
import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerDirective } from './color-picker.directive';
var ColorPickerModule = (function () {
    function ColorPickerModule() {
    }
    return ColorPickerModule;
}());
export { ColorPickerModule };
ColorPickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                providers: [ColorPickerService],
                declarations: [ColorPickerComponent, ColorPickerDirective, TextDirective, SliderDirective],
                exports: [ColorPickerDirective],
                entryComponents: [ColorPickerComponent]
            },] },
];
/** @nocollapse */
ColorPickerModule.ctorParameters = function () { return []; };
//# sourceMappingURL=color-picker.module.js.map