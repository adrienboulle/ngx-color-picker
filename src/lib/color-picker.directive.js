import { Directive, Input, Output, EventEmitter, ElementRef, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { ColorPickerService } from './color-picker.service';
import { ColorPickerComponent } from './color-picker.component';
export class ColorPickerDirective {
    constructor(vcRef, el, service, cfr, cdr) {
        this.vcRef = vcRef;
        this.el = el;
        this.service = service;
        this.cfr = cfr;
        this.cdr = cdr;
        this.colorPickerSelect = new EventEmitter(true);
        this.colorPickerChange = new EventEmitter(false);
        this.cpInputChange = new EventEmitter(true);
        this.cpSliderChange = new EventEmitter(true);
        this.cpToggleChange = new EventEmitter(true);
        this.cpPosition = 'right';
        this.cpPositionOffset = '0%';
        this.cpPositionRelativeToArrow = false;
        this.cpOutputFormat = 'hex';
        this.cpPresetLabel = 'Preset colors';
        this.cpCancelButton = false;
        this.cpCancelButtonClass = 'cp-cancel-button-class';
        this.cpCancelButtonText = 'Cancel';
        this.cpOKButton = false;
        this.cpOKButtonClass = 'cp-ok-button-class';
        this.cpOKButtonText = 'OK';
        this.cpFallbackColor = '#fff';
        this.cpHeight = 'auto';
        this.cpWidth = '230px';
        this.cpIgnoredElements = [];
        this.cpDialogDisplay = 'popup';
        this.cpSaveClickOutside = true;
        this.cpAlphaChannel = 'hex6';
        this.ignoreChanges = false;
        this.created = false;
    }
    ngOnChanges(changes) {
        if (changes.cpToggle) {
            if (changes.cpToggle.currentValue)
                this.openDialog();
            if (!changes.cpToggle.currentValue && this.dialog)
                this.dialog.closeColorPicker();
        }
        if (changes.colorPicker) {
            if (this.dialog && !this.ignoreChanges) {
                if (this.cpDialogDisplay === 'inline') {
                    this.dialog.setInitialColor(changes.colorPicker.currentValue);
                }
                this.dialog.setColorFromString(changes.colorPicker.currentValue, false);
            }
            this.ignoreChanges = false;
        }
        if (changes.cpPresetLabel || changes.cpPresetColors) {
            if (this.dialog) {
                this.dialog.setPresetConfig(this.cpPresetLabel, this.cpPresetColors);
            }
        }
    }
    ngOnInit() {
        let hsva = this.service.stringToHsva(this.colorPicker);
        if (hsva === null)
            hsva = this.service.stringToHsva(this.colorPicker, true);
        if (hsva == null) {
            hsva = this.service.stringToHsva(this.cpFallbackColor);
        }
        let color = this.service.outputFormat(hsva, this.cpOutputFormat, this.cpAlphaChannel === 'hex8');
        if (color !== this.colorPicker) {
            //setTimeout(() => {
            this.colorPickerChange.emit(color);
            this.cdr.detectChanges();
        }
    }
    onClick() {
        if (this.cpIgnoredElements.filter((item) => item === this.el.nativeElement).length === 0) {
            this.openDialog();
        }
    }
    openDialog() {
        if (!this.created) {
            this.created = true;
            const compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent);
            const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
            const cmpRef = this.vcRef.createComponent(compFactory, 0, injector, []);
            cmpRef.instance.setDialog(this, this.el, this.colorPicker, this.cpPosition, this.cpPositionOffset, this.cpPositionRelativeToArrow, this.cpOutputFormat, this.cpPresetLabel, this.cpPresetColors, this.cpCancelButton, this.cpCancelButtonClass, this.cpCancelButtonText, this.cpOKButton, this.cpOKButtonClass, this.cpOKButtonText, this.cpHeight, this.cpWidth, this.cpIgnoredElements, this.cpDialogDisplay, this.cpSaveClickOutside, this.cpAlphaChannel);
            this.dialog = cmpRef.instance;
        }
        else if (this.dialog) {
            this.dialog.openDialog(this.colorPicker);
        }
    }
    colorChanged(value, ignore = true) {
        this.ignoreChanges = ignore;
        this.colorPickerChange.emit(value);
    }
    colorSelected(value) {
        this.colorPickerSelect.emit(value);
    }
    inputChanged(event) {
        this.cpInputChange.emit(event);
    }
    sliderChanged(event) {
        this.cpSliderChange.emit(event);
    }
    changeInput(value) {
        this.dialog.setColorFromString(value, true);
    }
    toggle(value) {
        this.cpToggleChange.emit(value);
    }
}
ColorPickerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[colorPicker]',
                host: {
                    '(input)': 'changeInput($event.target.value)',
                    '(click)': 'onClick()'
                }
            },] },
];
/** @nocollapse */
ColorPickerDirective.ctorParameters = () => [
    { type: ViewContainerRef, },
    { type: ElementRef, },
    { type: ColorPickerService, },
    { type: ComponentFactoryResolver, },
    { type: ChangeDetectorRef, },
];
ColorPickerDirective.propDecorators = {
    'colorPicker': [{ type: Input, args: ['colorPicker',] },],
    'colorPickerSelect': [{ type: Output, args: ['colorPickerSelect',] },],
    'colorPickerChange': [{ type: Output, args: ['colorPickerChange',] },],
    'cpToggle': [{ type: Input, args: ['cpToggle',] },],
    'cpInputChange': [{ type: Output, args: ['cpInputChange',] },],
    'cpSliderChange': [{ type: Output, args: ['cpSliderChange',] },],
    'cpToggleChange': [{ type: Output, args: ['cpToggleChange',] },],
    'cpPosition': [{ type: Input, args: ['cpPosition',] },],
    'cpPositionOffset': [{ type: Input, args: ['cpPositionOffset',] },],
    'cpPositionRelativeToArrow': [{ type: Input, args: ['cpPositionRelativeToArrow',] },],
    'cpOutputFormat': [{ type: Input, args: ['cpOutputFormat',] },],
    'cpPresetLabel': [{ type: Input, args: ['cpPresetLabel',] },],
    'cpPresetColors': [{ type: Input, args: ['cpPresetColors',] },],
    'cpCancelButton': [{ type: Input, args: ['cpCancelButton',] },],
    'cpCancelButtonClass': [{ type: Input, args: ['cpCancelButtonClass',] },],
    'cpCancelButtonText': [{ type: Input, args: ['cpCancelButtonText',] },],
    'cpOKButton': [{ type: Input, args: ['cpOKButton',] },],
    'cpOKButtonClass': [{ type: Input, args: ['cpOKButtonClass',] },],
    'cpOKButtonText': [{ type: Input, args: ['cpOKButtonText',] },],
    'cpFallbackColor': [{ type: Input, args: ['cpFallbackColor',] },],
    'cpHeight': [{ type: Input, args: ['cpHeight',] },],
    'cpWidth': [{ type: Input, args: ['cpWidth',] },],
    'cpIgnoredElements': [{ type: Input, args: ['cpIgnoredElements',] },],
    'cpDialogDisplay': [{ type: Input, args: ['cpDialogDisplay',] },],
    'cpSaveClickOutside': [{ type: Input, args: ['cpSaveClickOutside',] },],
    'cpAlphaChannel': [{ type: Input, args: ['cpAlphaChannel',] },],
};
//# sourceMappingURL=color-picker.directive.js.map