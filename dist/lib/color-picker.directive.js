import { Directive, Input, Output, EventEmitter, ElementRef, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { ColorPickerService } from './color-picker.service';
import { ColorPickerComponent } from './color-picker.component';
var ColorPickerDirective = (function () {
    function ColorPickerDirective(vcRef, el, service, cfr, cdr) {
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
    ColorPickerDirective.prototype.ngOnChanges = function (changes) {
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
    };
    ColorPickerDirective.prototype.ngOnInit = function () {
        var hsva = this.service.stringToHsva(this.colorPicker);
        if (hsva === null)
            hsva = this.service.stringToHsva(this.colorPicker, true);
        if (hsva == null) {
            hsva = this.service.stringToHsva(this.cpFallbackColor);
        }
        var color = this.service.outputFormat(hsva, this.cpOutputFormat, this.cpAlphaChannel === 'hex8');
        if (color !== this.colorPicker) {
            //setTimeout(() => {
            this.colorPickerChange.emit(color);
            this.cdr.detectChanges();
        }
    };
    ColorPickerDirective.prototype.onClick = function () {
        var _this = this;
        if (this.cpIgnoredElements.filter(function (item) { return item === _this.el.nativeElement; }).length === 0) {
            this.openDialog();
        }
    };
    ColorPickerDirective.prototype.openDialog = function () {
        if (!this.created) {
            this.created = true;
            var compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent);
            var injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
            var cmpRef = this.vcRef.createComponent(compFactory, 0, injector, []);
            cmpRef.instance.setDialog(this, this.el, this.colorPicker, this.cpPosition, this.cpPositionOffset, this.cpPositionRelativeToArrow, this.cpOutputFormat, this.cpPresetLabel, this.cpPresetColors, this.cpCancelButton, this.cpCancelButtonClass, this.cpCancelButtonText, this.cpOKButton, this.cpOKButtonClass, this.cpOKButtonText, this.cpHeight, this.cpWidth, this.cpIgnoredElements, this.cpDialogDisplay, this.cpSaveClickOutside, this.cpAlphaChannel);
            this.dialog = cmpRef.instance;
        }
        else if (this.dialog) {
            this.dialog.openDialog(this.colorPicker);
        }
    };
    ColorPickerDirective.prototype.colorChanged = function (value, ignore) {
        if (ignore === void 0) { ignore = true; }
        this.ignoreChanges = ignore;
        this.colorPickerChange.emit(value);
    };
    ColorPickerDirective.prototype.colorSelected = function (value) {
        this.colorPickerSelect.emit(value);
    };
    ColorPickerDirective.prototype.inputChanged = function (event) {
        this.cpInputChange.emit(event);
    };
    ColorPickerDirective.prototype.sliderChanged = function (event) {
        this.cpSliderChange.emit(event);
    };
    ColorPickerDirective.prototype.changeInput = function (value) {
        this.dialog.setColorFromString(value, true);
    };
    ColorPickerDirective.prototype.toggle = function (value) {
        this.cpToggleChange.emit(value);
    };
    return ColorPickerDirective;
}());
export { ColorPickerDirective };
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
ColorPickerDirective.ctorParameters = function () { return [
    { type: ViewContainerRef, },
    { type: ElementRef, },
    { type: ColorPickerService, },
    { type: ComponentFactoryResolver, },
    { type: ChangeDetectorRef, },
]; };
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