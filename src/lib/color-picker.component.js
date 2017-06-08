import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ColorPickerService } from './color-picker.service';
import { Rgba, Hsla, Hsva } from './formats';
import { SliderPosition, SliderDimension } from './helpers';
var ColorPickerComponent = (function () {
    function ColorPickerComponent(el, cdr, service) {
        this.el = el;
        this.cdr = cdr;
        this.service = service;
        this.dialogArrowSize = 10;
        this.dialogArrowOffset = 15;
    }
    ColorPickerComponent.prototype.setDialog = function (instance, elementRef, color, cpPosition, cpPositionOffset, cpPositionRelativeToArrow, cpOutputFormat, cpPresetLabel, cpPresetColors, cpCancelButton, cpCancelButtonClass, cpCancelButtonText, cpOKButton, cpOKButtonClass, cpOKButtonText, cpHeight, cpWidth, cpIgnoredElements, cpDialogDisplay, cpSaveClickOutside, cpAlphaChannel) {
        this.directiveInstance = instance;
        this.initialColor = color;
        this.directiveElementRef = elementRef;
        this.cpPosition = cpPosition;
        this.cpPositionOffset = parseInt(cpPositionOffset);
        if (!cpPositionRelativeToArrow) {
            this.dialogArrowOffset = 0;
        }
        this.cpOutputFormat = cpOutputFormat;
        this.cpPresetLabel = cpPresetLabel;
        this.cpPresetColors = cpPresetColors;
        this.cpCancelButton = cpCancelButton;
        this.cpCancelButtonClass = cpCancelButtonClass;
        this.cpCancelButtonText = cpCancelButtonText;
        this.cpOKButton = cpOKButton;
        this.cpOKButtonClass = cpOKButtonClass;
        this.cpOKButtonText = cpOKButtonText;
        this.cpHeight = parseInt(cpHeight);
        this.cpWidth = parseInt(cpWidth);
        if (!this.cpWidth) {
            this.cpWidth = elementRef.nativeElement.offsetWidth;
        }
        this.cpIgnoredElements = cpIgnoredElements;
        this.cpDialogDisplay = cpDialogDisplay;
        if (this.cpDialogDisplay === 'inline') {
            this.dialogArrowOffset = 0;
            this.dialogArrowSize = 0;
        }
        this.cpSaveClickOutside = cpSaveClickOutside;
        this.cpAlphaChannel = cpAlphaChannel;
    };
    ColorPickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var alphaWidth = this.alphaSlider.nativeElement.offsetWidth;
        var hueWidth = this.hueSlider.nativeElement.offsetWidth;
        this.sliderDimMax = new SliderDimension(hueWidth, this.cpWidth, 130, alphaWidth);
        this.slider = new SliderPosition(0, 0, 0, 0);
        if (this.cpOutputFormat === 'rgba') {
            this.format = 1;
        }
        else if (this.cpOutputFormat === 'hsla') {
            this.format = 2;
        }
        else {
            this.format = 0;
        }
        this.listenerMouseDown = function (event) { _this.onMouseDown(event); };
        this.listenerResize = function () { _this.onResize(); };
        this.openDialog(this.initialColor, false);
    };
    ColorPickerComponent.prototype.ngAfterViewInit = function () {
        if (this.cpWidth != 230) {
            var alphaWidth = this.alphaSlider.nativeElement.offsetWidth;
            var hueWidth = this.hueSlider.nativeElement.offsetWidth;
            this.sliderDimMax = new SliderDimension(hueWidth, this.cpWidth, 130, alphaWidth);
            this.update(false);
            this.cdr.detectChanges();
        }
    };
    ColorPickerComponent.prototype.setInitialColor = function (color) {
        this.initialColor = color;
    };
    ColorPickerComponent.prototype.setPresetConfig = function (cpPresetLabel, cpPresetColors) {
        this.cpPresetLabel = cpPresetLabel;
        this.cpPresetColors = cpPresetColors;
    };
    ColorPickerComponent.prototype.openDialog = function (color, emit) {
        if (emit === void 0) { emit = true; }
        this.setInitialColor(color);
        this.setColorFromString(color, emit);
        this.openColorPicker();
    };
    ColorPickerComponent.prototype.cancelColor = function () {
        this.setColorFromString(this.initialColor, true);
        if (this.cpDialogDisplay === 'popup') {
            this.directiveInstance.colorChanged(this.initialColor, true);
            this.closeColorPicker();
        }
    };
    ColorPickerComponent.prototype.oKColor = function () {
        if (this.cpDialogDisplay === 'popup') {
            this.closeColorPicker();
        }
        if (this.outputColor) {
            this.directiveInstance.colorSelected(this.outputColor);
        }
    };
    ColorPickerComponent.prototype.setColorFromString = function (value, emit) {
        if (emit === void 0) { emit = true; }
        var hsva;
        if (this.cpAlphaChannel === 'hex8') {
            hsva = this.service.stringToHsva(value, true);
            if (!hsva && !this.hsva) {
                hsva = this.service.stringToHsva(value, false);
            }
        }
        else {
            hsva = this.service.stringToHsva(value, false);
        }
        if (hsva) {
            this.hsva = hsva;
            this.update(emit);
        }
    };
    ColorPickerComponent.prototype.onMouseDown = function (event) {
        if ((!this.isDescendant(this.el.nativeElement, event.target)
            && event.target != this.directiveElementRef.nativeElement &&
            this.cpIgnoredElements.filter(function (item) { return item === event.target; }).length === 0) && this.cpDialogDisplay === 'popup') {
            if (!this.cpSaveClickOutside) {
                this.setColorFromString(this.initialColor, false);
                this.directiveInstance.colorChanged(this.initialColor);
            }
            this.closeColorPicker();
        }
    };
    ColorPickerComponent.prototype.openColorPicker = function () {
        var _this = this;
        if (!this.show) {
            this.show = true;
            this.hidden = true;
            setTimeout(function () {
                _this.setDialogPosition();
                _this.hidden = false;
                _this.cdr.detectChanges();
            }, 0);
            this.directiveInstance.toggle(true);
            document.addEventListener('mousedown', this.listenerMouseDown);
            window.addEventListener('resize', this.listenerResize);
        }
    };
    ColorPickerComponent.prototype.closeColorPicker = function () {
        if (this.show) {
            this.show = false;
            this.directiveInstance.toggle(false);
            document.removeEventListener('mousedown', this.listenerMouseDown);
            window.removeEventListener('resize', this.listenerResize);
        }
    };
    ColorPickerComponent.prototype.onResize = function () {
        if (this.position === 'fixed') {
            this.setDialogPosition();
        }
    };
    ColorPickerComponent.prototype.setDialogPosition = function () {
        var dialogHeight = this.dialogElement.nativeElement.offsetHeight;
        var node = this.directiveElementRef.nativeElement, position = 'static';
        var parentNode = null;
        while (node !== null && node.tagName !== 'HTML') {
            position = window.getComputedStyle(node).getPropertyValue("position");
            if (position !== 'static' && parentNode === null) {
                parentNode = node;
            }
            if (position === 'fixed') {
                break;
            }
            node = node.parentNode;
        }
        if (position !== 'fixed') {
            var boxDirective = this.createBox(this.directiveElementRef.nativeElement, true);
            if (parentNode === null) {
                parentNode = node;
            }
            var boxParent = this.createBox(parentNode, true);
            this.top = boxDirective.top - boxParent.top;
            this.left = boxDirective.left - boxParent.left;
        }
        else {
            var boxDirective = this.createBox(this.directiveElementRef.nativeElement, false);
            this.top = boxDirective.top;
            this.left = boxDirective.left;
            this.position = 'fixed';
        }
        if (this.cpPosition === 'left') {
            this.top += boxDirective.height * this.cpPositionOffset / 100 - this.dialogArrowOffset;
            this.left -= this.cpWidth + this.dialogArrowSize - 2;
        }
        else if (this.cpPosition === 'top') {
            this.top -= dialogHeight + this.dialogArrowSize;
            this.left += this.cpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
            this.arrowTop = dialogHeight - 1;
        }
        else if (this.cpPosition === 'bottom') {
            this.top += boxDirective.height + this.dialogArrowSize;
            this.left += this.cpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
        }
        else {
            this.top += boxDirective.height * this.cpPositionOffset / 100 - this.dialogArrowOffset;
            this.left += boxDirective.width + this.dialogArrowSize - 2;
        }
    };
    ColorPickerComponent.prototype.setSaturation = function (val) {
        var hsla = this.service.hsva2hsla(this.hsva);
        hsla.s = val.v / val.rg;
        this.hsva = this.service.hsla2hsva(hsla);
        this.update();
        this.directiveInstance.inputChanged({ slider: 'saturation', value: val });
    };
    ColorPickerComponent.prototype.setLightness = function (val) {
        var hsla = this.service.hsva2hsla(this.hsva);
        hsla.l = val.v / val.rg;
        this.hsva = this.service.hsla2hsva(hsla);
        this.update();
        this.directiveInstance.inputChanged({ slider: 'lightness', value: val });
    };
    ColorPickerComponent.prototype.setHue = function (val) {
        this.hsva.h = val.v / val.rg;
        this.update();
        this.directiveInstance.sliderChanged({ slider: 'hue', value: val });
    };
    ColorPickerComponent.prototype.setAlpha = function (val) {
        this.hsva.a = val.v / val.rg;
        this.update();
        this.directiveInstance.sliderChanged({ slider: 'alpha', value: val });
    };
    ColorPickerComponent.prototype.setR = function (val) {
        var rgba = this.service.hsvaToRgba(this.hsva);
        rgba.r = val.v / val.rg;
        this.hsva = this.service.rgbaToHsva(rgba);
        this.update();
        this.directiveInstance.inputChanged({ slider: 'red', value: val });
    };
    ColorPickerComponent.prototype.setG = function (val) {
        var rgba = this.service.hsvaToRgba(this.hsva);
        rgba.g = val.v / val.rg;
        this.hsva = this.service.rgbaToHsva(rgba);
        this.update();
        this.directiveInstance.inputChanged({ slider: 'green', value: val });
    };
    ColorPickerComponent.prototype.setB = function (val) {
        var rgba = this.service.hsvaToRgba(this.hsva);
        rgba.b = val.v / val.rg;
        this.hsva = this.service.rgbaToHsva(rgba);
        this.update();
        this.directiveInstance.inputChanged({ slider: 'blue', value: val });
    };
    ColorPickerComponent.prototype.setA = function (val) {
        this.hsva.a = val.v / val.rg;
        this.update();
        this.directiveInstance.inputChanged({ slider: 'alpha', value: val });
    };
    ColorPickerComponent.prototype.setHex = function (val) {
        this.setColorFromString(val);
        this.directiveInstance.inputChanged({ slider: 'hex', value: val });
    };
    ColorPickerComponent.prototype.setSaturationAndBrightness = function (val) {
        this.hsva.s = val.s / val.rgX;
        this.hsva.v = val.v / val.rgY;
        this.update();
        this.directiveInstance.sliderChanged({ slider: 'saturation-lightness', value: val });
    };
    ColorPickerComponent.prototype.formatPolicy = function () {
        this.format = (this.format + 1) % 3;
        if (this.format === 0 && this.hsva.a < 1 && this.cpAlphaChannel === 'hex6') {
            this.format++;
        }
        return this.format;
    };
    ColorPickerComponent.prototype.update = function (emit) {
        if (emit === void 0) { emit = true; }
        if (this.sliderDimMax) {
            var hsla = this.service.hsva2hsla(this.hsva);
            var rgba = this.service.denormalizeRGBA(this.service.hsvaToRgba(this.hsva));
            var hueRgba = this.service.denormalizeRGBA(this.service.hsvaToRgba(new Hsva(this.hsva.h, 1, 1, 1)));
            this.hslaText = new Hsla(Math.round((hsla.h) * 360), Math.round(hsla.s * 100), Math.round(hsla.l * 100), Math.round(hsla.a * 100) / 100);
            this.rgbaText = new Rgba(rgba.r, rgba.g, rgba.b, Math.round(rgba.a * 100) / 100);
            this.hexText = this.service.hexText(rgba, this.cpAlphaChannel === 'hex8');
            this.alphaSliderColor = 'rgb(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ')';
            this.hueSliderColor = 'rgb(' + hueRgba.r + ',' + hueRgba.g + ',' + hueRgba.b + ')';
            if (this.format === 0 && this.hsva.a < 1 && this.cpAlphaChannel === 'hex6') {
                this.format++;
            }
            var lastOutput = this.outputColor;
            this.outputColor = this.service.outputFormat(this.hsva, this.cpOutputFormat, this.cpAlphaChannel === 'hex8');
            this.selectedColor = this.service.outputFormat(this.hsva, 'rgba', false);
            this.slider = new SliderPosition((this.hsva.h) * this.sliderDimMax.h - 8, this.hsva.s * this.sliderDimMax.s - 8, (1 - this.hsva.v) * this.sliderDimMax.v - 8, this.hsva.a * this.sliderDimMax.a - 8);
            if (emit && lastOutput !== this.outputColor) {
                this.directiveInstance.colorChanged(this.outputColor);
            }
        }
    };
    ColorPickerComponent.prototype.isDescendant = function (parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    ColorPickerComponent.prototype.createBox = function (element, offset) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    };
    return ColorPickerComponent;
}());
export { ColorPickerComponent };
ColorPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-picker',
                templateUrl: './color-picker.component.html',
                styleUrls: ['./color-picker.component.css']
            },] },
];
/** @nocollapse */
ColorPickerComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: ColorPickerService, },
]; };
ColorPickerComponent.propDecorators = {
    'hueSlider': [{ type: ViewChild, args: ['hueSlider',] },],
    'alphaSlider': [{ type: ViewChild, args: ['alphaSlider',] },],
    'dialogElement': [{ type: ViewChild, args: ['dialogPopup',] },],
};
//# sourceMappingURL=color-picker.component.js.map